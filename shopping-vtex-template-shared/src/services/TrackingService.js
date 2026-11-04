import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'

export default class TrackingService {
	static _logInTerminal = (...args) => {
		const TURNED_ON = false
		if (!TURNED_ON) return
		console.log('[TRACKING]', ...args)
	}

	static _resolveCategory = item => {
		let ids =
			item.productCategoryIds?.split('/').filter(Boolean) || item.categoriesIds[0]?.split('/').filter(Boolean)
		let categories = item.productCategories || item.categories[0]?.split('/').filter(Boolean)
		let result = {}

		ids.forEach((id, index) => {
			const key = index === 0 ? 'item_category' : `item_category${index + 1}`
			result[key] = item.productCategories ? categories[id] : categories[index]
		})

		return result
	}

	static _resolveInsiderProductMetadata = product => {
		const availableSku = product.items.find(item =>
			item.sellers.some(seller => seller.commertialOffer?.AvailableQuantity > 0)
		)
		const mainSeller = availableSku?.sellers.find(seller => seller.sellerDefault) || availableSku?.sellers[0]

		return {
			productID: product?.productId,
			name: product?.productName,
			taxonomy: product?.categoryTree?.map(i => i.name) || [],
			imageURL: product?.items?.[0]?.images?.[0]?.imageUrl || '',
			price: mainSeller?.commertialOffer?.Price || 0,
			currency: 'BRL'
		}
	}

	static _resolveGAProductMetadata = product => {
		const categories = product?.categoryTree?.reduce((acc, curr, index) => {
			if (index === 0) {
				acc[`item_category`] = curr.name
			} else {
				acc[`item_category${index + 1}`] = curr.name
			}
			return acc
		}, {})

		const availableSku = product.items.find(item =>
			item.sellers.some(seller => seller.commertialOffer?.AvailableQuantity > 0)
		)
		const mainSeller = availableSku?.sellers.find(seller => seller.sellerDefault) || availableSku?.sellers[0]

		return {
			item_id: product.productId,
			item_name: product.productName,
			item_brand: product.brand || '',
			...categories,
			price: mainSeller?.commertialOffer?.Price
		}
	}

	static _resolveGACartItemMetadata = item => {
		const categories = Object.values(item?.productCategories)?.reduce((acc, curr, index) => {
			if (index === 0) {
				acc[`item_category`] = curr
			} else {
				acc[`item_category${index + 1}`] = curr
			}
			return acc
		}, {})

		return {
			item_id: item.productId,
			item_name: item.name,
			item_brand: item.additionalInfo.brandName || '',
			...categories,
			price: item?.priceDefinition?.calculatedSellingPrice / 100,
			quantity: item.quantity
		}
	}

	// ================= Inngage =================
	// Payloads seguem o JSON de eventos da Inngage (fonte da verdade): nomes exatos, sem campos extras.

	/**
	 * Envia um evento à Inngage. Não faz nada se o módulo nativo não estiver disponível.
	 */
	static inngageEvent = async (eventName, data) => {
		try {
			const modules = await Eitri.modules()
			const logEvent = modules?.inngage?.logEvent
			if (!logEvent) return
			await logEvent({ eventName, data })
			this._logInTerminal('inngage', eventName, data)
		} catch (e) {
			console.error('inngageEvent', e)
		}
	}

	// Domínio da loja: Vtex.configs.domain, com fallback para Vtex.configs.host
	static _inngageDomain = () => {
		const raw = `${Vtex?.configs?.domain || Vtex?.configs?.host || ''}`.trim()
		if (!raw) return ''
		const withProtocol = /^https?:\/\//i.test(raw) ? raw.replace(/^http:\/\//i, 'https://') : `https://${raw}`
		return withProtocol.replace(/\/+$/, '')
	}

	static _inngageProductUrl = linkText => {
		const domain = this._inngageDomain()
		return linkText && domain ? `${domain}/${linkText}/p` : ''
	}

	// items (String) = productId-nome de cada item, separados por vírgula
	static _inngageCartItems = cart =>
		(cart?.items || []).map(item => `${item.productId}-${item.name || item.productName || item.nameComplete}`).join(',')

	static _inngageCartValue = cart => {
		const totalizer = cart?.totalizers?.find(i => i.id === 'Items')
		const value = totalizer?.value ?? cart?.value
		return typeof value === 'number' ? Number((value / 100).toFixed(2)) : 0
	}

	// Normaliza um produto do catálogo (product + sku) para os campos usados nos eventos
	static _inngageCatalogItem = (product, sku) => {
		const _sku =
			sku ||
			product?.items?.find(item => item.sellers?.some(seller => seller.commertialOffer?.AvailableQuantity > 0)) ||
			product?.items?.[0]
		const seller = _sku?.sellers?.find(s => s.sellerDefault) || _sku?.sellers?.[0]
		const price = seller?.commertialOffer?.Price
		return {
			id: `${product?.productId || ''}`,
			name: product?.productName || _sku?.nameComplete || _sku?.name || '',
			brand: product?.brand || '',
			category: product?.categoryTree?.[0]?.name || product?.categories?.[0]?.split('/').filter(Boolean)[0] || '',
			imageUrl: _sku?.images?.[0]?.imageUrl || '',
			url: this._inngageProductUrl(product?.linkText),
			price: typeof price === 'number' ? price : 0
		}
	}

	// Normaliza um item do orderForm para os campos usados nos eventos
	static _inngageCartItem = item => {
		const categoryId = item?.productCategoryIds?.split('/').filter(Boolean)[0]
		const domain = this._inngageDomain()
		const detailUrl = item?.detailUrl ? `/${item.detailUrl.replace(/^\/+/, '')}` : ''
		const price = item?.sellingPrice ?? item?.price
		return {
			id: `${item?.productId || ''}`,
			name: item?.name || '',
			brand: item?.additionalInfo?.brandName || '',
			category: (categoryId && item?.productCategories?.[categoryId]) || '',
			imageUrl: item?.imageUrl || '',
			url: domain && detailUrl ? `${domain}${detailUrl}` : '',
			price: typeof price === 'number' ? Number((price / 100).toFixed(2)) : 0
		}
	}

	static _inngageAddToCart = info =>
		this.inngageEvent('add_to_cart', {
			currency: 'BRL',
			id: info.id,
			item_image_url: info.imageUrl,
			item_name: info.name,
			item_url: info.url,
			price: info.price,
			type: info.brand
		})

	static _inngageRemoveFromCart = (item, quantity) => {
		const info = this._inngageCartItem(item)
		const qty = quantity ?? item?.quantity ?? 1
		return this.inngageEvent('remove_from_cart', {
			currency: 'BRL',
			item_brand: info.brand,
			item_category: info.category,
			item_id: info.id,
			item_name: info.name,
			value: Number((info.price * qty).toFixed(2))
		})
	}

	/**
	 * Inngage: aumento/redução de quantidade de um item do carrinho.
	 * Aumento envia add_to_cart; redução envia somente remove_from_cart com a quantidade removida.
	 */
	static cartItemQuantityChangedEvent = async (item, previousQuantity, newQuantity) => {
		try {
			const diff = Number(newQuantity || 0) - Number(previousQuantity || 0)
			if (!item || !diff) return
			if (diff > 0) this._inngageAddToCart(this._inngageCartItem(item))
			else this._inngageRemoveFromCart(item, -diff)
		} catch (e) {
			console.error('inngage cartItemQuantityChanged', e)
		}
	}

	/**
	 * Inngage: abertura de uma listagem de categoria.
	 * @param {Object} data { name, path (ex.: 'moda/vestidos'), imageUrl }
	 */
	static categoryViewEvent = async ({ name, path, imageUrl } = {}) => {
		try {
			const domain = this._inngageDomain()
			this.inngageEvent('category_view', {
				category_image_url: typeof imageUrl === 'string' ? imageUrl : '',
				category_name: name || '',
				category_url: domain && path ? `${domain}/${path}` : ''
			})
		} catch (e) {
			console.error('inngage categoryView', e)
		}
	}

	static sendScreenView = async (friendlyScreenName, screenFilename) => {
		Eitri.exposedApis.fb.currentScreen({ screen: friendlyScreenName, screenClass: screenFilename })
	}

	static insiderVisitHomepage = async () => {
		Eitri.exposedApis.insider.visitHomepage()
	}

	static sendRecommendedGaEvent = async (eventName, data = {}) => {
		await Eitri.exposedApis.fb.logEvent({ eventName, data })
		this._logInTerminal('GA', eventName, data)
	}

	/**
	 * Registra quando um anúncio é exibido para o usuário.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#ad_impression
	 */
	static adImpressionEvent = async data => TrackingService.sendRecommendedGaEvent('ad_impression', data)

	/**
	 * Registra quando o usuário envia dados de pagamento no checkout.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#add_payment_info
	 */
	static addPaymentInfoEvent = async (cart, paymentType) => {
		try {
			if (!paymentType) {
				const paymentId = cart.paymentData?.payments?.[0]?.paymentSystem
				paymentType = cart.paymentData?.paymentSystems?.find(p => p.stringId === paymentId)?.name
			}

			// evento enviado automaticamente pelo Vtex service se autoTriggerGAEvents() for true
			const totalizer = cart?.totalizers?.find(i => i.id === 'Items')
			const value = totalizer?.value ? totalizer.value / 100 : cart.value ? cart.value / 100 : ''

			TrackingService.sendRecommendedGaEvent('add_payment_info', {
				currency: 'BRL',
				payment_type: paymentType || '',
				value: value,
				items: cart.items.map(item => ({
					item_id: item.productId,
					item_name: item.name || item.productName || item.nameComplete,
					price: item.price ? item.price / 100 : ''
				}))
			})

			// TrackingService.inngageEvent('add_payment_info', {
			// 	currency: 'BRL',
			// 	payment_type: paymentType || ''
			// })
		} catch (e) {
			console.log('Error on trackAddPaymentInfo', e)
		}
	}

	/**
	 * Registra quando o usuário envia dados de frete no checkout.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#add_shipping_info
	 */
	static addShippingInfoEvent = async cart => {
		try {
			const items = cart.items.map(item => {
				const categories = TrackingService._resolveCategory(item)

				return {
					item_id: item.id,
					item_name: item.name,
					item_brand: item.additionalInfo?.brandName,
					...categories,
					price: item.sellingPrice / 100,
					quantity: item.quantity
				}
			})

			let shippingSelected = cart?.shippingData?.logisticsInfo?.map(item => item.selectedSla)
			const uniqueSla = [...new Set(shippingSelected)]

			const totalItemPrice = cart.totalizers.find(item => item.id === 'Items')?.value / 100

			const params = {
				currency: cart?.storePreferencesData?.currencyCode || 'BRL',
				value: totalItemPrice,
				shipping_tier: uniqueSla.join(';'),
				items: items
			}
			TrackingService.sendRecommendedGaEvent('add_shipping_info', params)
		} catch (error) {
			console.error('[SHARED] Error on addShippingInfo', error)
		}
	}

	/**
	 * Registra quando um item é adicionado ao carrinho.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#add_to_cart
	 */
	static addToCartEvent = async (product, sku) => {
		// GA
		try {
			const item = this._resolveGAProductMetadata(product)

			const params = {
				currency: 'BRL',
				value: item.price,
				items: [item]
			}
			TrackingService.sendRecommendedGaEvent('add_to_cart', params)
		} catch (e) {
			console.error('Error on analytics addItemToCart', e)
		}

		// Insider
		try {
			const productMetadata = this._resolveInsiderProductMetadata(product)
			const payload = {
				product: productMetadata
			}
			this._logInTerminal('insider', 'itemAddedToCart', payload)
			Eitri.exposedApis.insider.itemAddedToCart(payload)
		} catch (error) {
			console.error(error, 'insider.addItemToCart')
		}

		// Inngage
		try {
			this._inngageAddToCart(this._inngageCatalogItem(product, sku))
		} catch (e) {
			console.error('inngage addToCart', e)
		}
	}

	/**
	 * Registra quando um item é adicionado à lista de desejos.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#add_to_wishlist
	 */
	static addToWishlistEvent = async (data, product, skuId) => {
		if (data) TrackingService.sendRecommendedGaEvent('add_to_wishlist', data)

		// Inngage
		try {
			if (!product) return
			const sku = product?.items?.find(item => `${item.itemId}` === `${skuId}`)
			const info = TrackingService._inngageCatalogItem(product, sku)
			TrackingService.inngageEvent('add_to_wishlist', {
				currency: 'BRL',
				item_category: info.category,
				item_id: info.id,
				item_image_url: info.imageUrl,
				item_name: info.name,
				item_url: info.url,
				price: info.price
			})
		} catch (e) {
			console.error('inngage addToWishlist', e)
		}
	}

	/**
	 * Registra quando o usuário inicia o checkout.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#begin_checkout
	 */
	static beginCheckoutEvent = async cart => {
		try {
			const totalizer = cart?.totalizers?.find(i => i.id === 'Items')
			const value = totalizer?.value ? totalizer.value / 100 : cart.value ? cart.value / 100 : ''

			TrackingService.sendRecommendedGaEvent('begin_checkout', {
				currency: 'BRL',
				value: value,
				coupon: cart.marketingData?.coupon || '',
				items: cart.items.map(item => this._resolveGACartItemMetadata(item))
			})
		} catch (e) {
			console.log('Error on trackBeginCheckout', e)
		}

		// Inngage
		try {
			TrackingService.inngageEvent('begin_checkout', {
				coupon: cart?.marketingData?.coupon || '',
				currency: 'BRL',
				items: TrackingService._inngageCartItems(cart),
				value: TrackingService._inngageCartValue(cart)
			})
		} catch (e) {
			console.error('inngage beginCheckout', e)
		}
	}

	/**
	 * Registra quando o usuário faz login.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#login
	 */
	static loginEvent = async method => {
		// GA
		TrackingService.sendRecommendedGaEvent('login', { method })

		// Insider
		Eitri.exposedApis.insider.signUpConfirmation()
	}

	/**
	 * Registra uma compra concluída.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#purchase
	 */
	static purchaseEvent = async (cart, orderId) => {
		// GA
		try {
			const items = cart.items.map(item => {
				const categories = TrackingService._resolveCategory(item)

				return {
					item_id: item.id,
					item_name: item.name,
					item_brand: item.additionalInfo?.brandName,
					...categories,
					price: item.sellingPrice / 100,
					quantity: item.quantity
				}
			})

			// const totalItemPrice = cart.totalizers.find(item => item.id === 'Items')?.value / 100
			const shippingPrice = cart.totalizers.find(item => item.id === 'Shipping')?.value / 100

			const coupon = cart?.marketingData?.coupon || undefined

			const params = {
				currency: 'BRL',
				value: cart?.value && cart.value > 0 ? cart.value / 100 : 0,
				transaction_id: orderId,
				shipping: shippingPrice,
				items: items,
				...(coupon && { coupon })
			}
			TrackingService._logInTerminal('ga', 'purchase', params)
			TrackingService.sendRecommendedGaEvent('purchase', params)
		} catch (error) {
			console.error('Erro ao montar log de compra', error)
		}

		// Insider
		try {
			for (const item of cart.items) {
				try {
					const insiderPayload = {
						saleID: cart?.orderFormId,
						product: {
							productID: `${item?.productId || ''}`,
							name: item?.name || '',
							taxonomy: Object.values(item.productCategories),
							imageURL: item?.imageUrl || '',
							price: item?.price || 0,
							currency: 'BRL'
						}
					}
					TrackingService._logInTerminal('insider', 'itemPurchased', insiderPayload)
					Eitri.exposedApis.insider.itemPurchased(insiderPayload)
				} catch (e) {
					console.error('insider.purchaseItem', e)
				}
			}
		} catch (e) {
			console.error('insider.purchase', e)
		}

		// Inngage: dispara na criação do pedido
		try {
			if (!orderId) return
			const shippingTotalizer = cart?.totalizers?.find(i => i.id === 'Shipping')
			TrackingService.inngageEvent('purchase', {
				coupon: cart?.marketingData?.coupon || '',
				currency: 'BRL',
				items: TrackingService._inngageCartItems(cart),
				shipping: ((shippingTotalizer?.value || 0) / 100).toFixed(2),
				transaction_id: `${orderId}`,
				value: cart?.value > 0 ? Number((cart.value / 100).toFixed(2)) : 0
			})
		} catch (e) {
			console.error('inngage purchase', e)
		}
	}

	/**
	 * Registra quando um item é removido do carrinho.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#remove_from_cart
	 */
	static removeFromCartEvent = async (cart, index, quantity) => {
		const itemRemoved = cart.items[index]

		try {
			const itemRemoved = cart.items[index]
			const item = this._resolveGACartItemMetadata(itemRemoved)

			const params = {
				currency: 'BRL',
				value: item.price,
				items: [item]
			}

			TrackingService.sendRecommendedGaEvent('remove_from_cart', params)
		} catch (e) {
			console.error('Error on analytics removeItemFromCart', e)
		}

		// Insider
		try {
			const payload = {
				productID: itemRemoved?.productId
			}
			this._logInTerminal('insider', 'itemAddedToCart', payload)
			Eitri.exposedApis.insider.itemRemovedFromCart(payload)
		} catch (error) {
			console.error(error, 'insider.itemRemovedFromCart')
		}

		// Inngage
		try {
			if (itemRemoved) this._inngageRemoveFromCart(itemRemoved, quantity)
		} catch (e) {
			console.error('inngage removeFromCart', e)
		}
	}

	/**
	 * Registra uma busca realizada pelo usuário.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#search
	 */
	static searchEvent = async term => {
		TrackingService.sendRecommendedGaEvent('search', {
			search_term: term
		})

		TrackingService.inngageEvent('search', {
			search_term: term || ''
		})
	}

	/**
	 * Registra quando o usuário seleciona um conteúdo.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#select_content
	 */
	static selectContentEvent = async data => TrackingService.sendRecommendedGaEvent('select_content', data)

	/**
	 * Registra quando o usuário seleciona um item.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#select_item
	 */
	static selectItemEvent = async data => TrackingService.sendRecommendedGaEvent('select_item', data)

	/**
	 * Registra quando o usuário seleciona uma promoção.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#select_promotion
	 */
	static selectPromotionEvent = async data => {
		try {
			TrackingService.sendRecommendedGaEvent('select_promotion', data)
		} catch (e) {}
	}

	/**
	 * Registra quando o usuário compartilha conteúdo.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#share
	 */
	static shareEvent = async (itemId, product) => {
		TrackingService.sendRecommendedGaEvent('share', {
			item_id: itemId
		})

		TrackingService.inngageEvent('share', {
			contentType: 'product',
			itemId: `${product?.productId || itemId || ''}`,
			method: 'link'
		})
	}

	/**
	 * Registra quando o usuário cria conta (signup).
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#sign_up
	 */
	static signUpEvent = async data => TrackingService.sendRecommendedGaEvent('sign_up', data)

	/**
	 * Registra visualização do carrinho.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#view_cart
	 */
	static viewCartEvent = async cart => {
		// GA
		const items = cart.items.map(item => this._resolveGACartItemMetadata(item))
		const totalizer = cart?.totalizers?.find(i => i.id === 'Items')
		const value = totalizer?.value ? totalizer.value / 100 : cart.value ? cart.value / 100 : ''

		const payload = {
			currency: 'BRL',
			value: value,
			items: items
		}
		this.sendRecommendedGaEvent('view_cart', payload)

		// Insider
		try {
			const insiderPayload = []
			for (const item of cart.items) {
				insiderPayload.push({
					productID: item.productId,
					name: item.name,
					taxonomy: Object.values(item.productCategories),
					imageURL: item.imageUrl,
					price: Number(item.price) / 100,
					quantity: item.quantity,
					currency: 'BRL'
				})
			}
			this._logInTerminal('insider', 'visitCartPage', { products: insiderPayload })
			Eitri.exposedApis.insider.visitCartPage({
				products: insiderPayload
			})
		} catch (e) {
			console.error('insider.visitCartPage', e)
		}

		// Inngage
		try {
			if (!cart?.items?.length) return
			this.inngageEvent('view_cart', {
				currency: 'BRL',
				items: this._inngageCartItems(cart),
				value: this._inngageCartValue(cart)
			})
		} catch (e) {
			console.error('inngage viewCart', e)
		}
	}

	/**
	 * Registra visualização de item/produto.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#view_item
	 */
	static viewItemEvent = async product => {
		// GA
		try {
			const item = this._resolveGAProductMetadata(product)
			const data = {
				currency: 'BRL',
				value: item?.price,
				items: [item]
			}
			this.sendRecommendedGaEvent('view_item', data)
		} catch (error) {
			console.error('Erro ao montar log de produto', error)
		}

		// Insider
		try {
			const productMetadata = this._resolveInsiderProductMetadata(product)
			const payload = {
				product: productMetadata
			}
			this._logInTerminal('insider', 'visitProductPage', payload)
			Eitri.exposedApis.insider.visitProductDetailPage(payload)
		} catch (e) {
			console.error('insiderVisitProductPage', e)
		}

		// Inngage
		try {
			const info = this._inngageCatalogItem(product)
			this.inngageEvent('view_item', {
				item_brand: info.brand,
				item_category: info.category,
				item_id: info.id,
				item_image_url: info.imageUrl,
				item_name: info.name,
				item_price: info.price,
				item_url: info.url
			})
		} catch (e) {
			console.error('inngage viewItem', e)
		}
	}

	/**
	 * Registra visualização de lista de itens.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#view_item_list
	 */
	static viewItemListEvent = async data => TrackingService.sendRecommendedGaEvent('view_item_list', data)

	/**
	 * Registra visualização de promoção.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#view_promotion
	 */
	static viewPromotionEvent = async data => TrackingService.sendRecommendedGaEvent('view_promotion', data)

	/**
	 * Registra visualização de resultados de busca.
	 * Docs: https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#view_search_results
	 */
	static viewSearchResultsEvent = async data => TrackingService.sendRecommendedGaEvent('view_search_results', data)
}
