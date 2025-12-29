import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { openCart, openProduct } from '../../services/NavigationService'
import { addToWishlist, productOnWishlist, removeItemFromWishlist } from '../../services/CustomerService'
import { formatPrice } from '../../utils/utils'
import { App } from 'eitri-shopping-vtex-shared'
import { ProductCardFullImage, ProductCardDefault } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'

// ========== Hooks Customizados ==========

/**
 * Hook para gerenciar o estado do produto no carrinho
 */
const useCartItem = (cart, itemId) => {
	return useMemo(() => {
		if (!cart?.items || !itemId) return null

		const index = cart.items.findIndex(cartItem => cartItem.id === itemId)
		if (index === -1) return null

		return { ...cart.items[index], index }
	}, [cart?.items, itemId])
}

/**
 * Hook para gerenciar wishlist
 */
const useWishlist = productId => {
	const [isOnWishlist, setIsOnWishlist] = useState(false)
	const [wishListId, setWishListId] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!productId) {
			setLoading(false)
			return
		}

		const checkWishlist = async () => {
			try {
				const { inList, listId } = await productOnWishlist(productId)
				setIsOnWishlist(inList)
				if (inList) setWishListId(listId)
			} catch (error) {
				console.error('Error checking wishlist:', error)
			} finally {
				setLoading(false)
			}
		}

		checkWishlist()
	}, [productId])

	const addToList = useCallback(
		async (itemName, itemId) => {
			if (!productId) return

			try {
				setLoading(true)
				setIsOnWishlist(true)
				const response = await addToWishlist(productId, itemName, itemId)
				setWishListId(response?.data?.addToList)
			} catch (error) {
				console.error('Error adding to wishlist:', error)
				setIsOnWishlist(false)
			} finally {
				setLoading(false)
			}
		},
		[productId]
	)

	const removeFromList = useCallback(async () => {
		if (!wishListId) return

		try {
			setLoading(true)
			setIsOnWishlist(false)
			await removeItemFromWishlist(wishListId)
		} catch (error) {
			console.error('Error removing from wishlist:', error)
			setIsOnWishlist(true)
		} finally {
			setLoading(false)
		}
	}, [wishListId])

	const toggle = useCallback(
		async (itemName, itemId) => {
			if (loading) return

			if (isOnWishlist) {
				await removeFromList()
			} else {
				await addToList(itemName, itemId)
			}
		},
		[loading, isOnWishlist, removeFromList, addToList]
	)

	return { isOnWishlist, loading, toggle }
}

// ========== Funções Auxiliares ==========

/**
 * Extrai o vídeo do produto baseado na config
 */
const getProductVideo = product => {
	const videoTag = App?.configs?.appConfigs?.productCard?.productVideoTag
	if (!videoTag) return ''

	const property = product?.properties?.find(prop => prop.name === videoTag)
	return property?.values?.[0] || ''
}

/**
 * Formata as parcelas do produto
 */
const formatInstallments = seller => {
	if (!seller?.commertialOffer?.Installments?.length) return ''

	const installments = seller.commertialOffer.Installments
	const maxInstallments = installments.reduce(
		(max, curr) => (curr.NumberOfInstallments > max.NumberOfInstallments ? curr : max),
		installments[0]
	)

	if (!maxInstallments || maxInstallments.NumberOfInstallments === 1) {
		return ''
	}

	return `em até ${maxInstallments.NumberOfInstallments}x ${formatPrice(maxInstallments.Value)}`
}

/**
 * Calcula o badge de desconto
 */
const calculateBadge = seller => {
	if (!seller?.commertialOffer) return ''

	const { Price, ListPrice } = seller.commertialOffer

	if (Price === ListPrice || !ListPrice) return ''

	const discount = ((ListPrice - Price) / ListPrice) * 100
	return `${discount.toFixed(0)}% OFF`
}

/**
 * Retorna o preço de lista formatado (se diferente do preço atual)
 */
const getFormattedListPrice = seller => {
	if (!seller?.commertialOffer) return ''

	const { Price, ListPrice } = seller.commertialOffer

	if (Price === ListPrice) return ''

	return formatPrice(ListPrice)
}

// ========== Componente Principal ==========

export default function ProductCard({ product, className }) {
	const { t } = useTranslation()
	const { addItem, removeItem, updateItemQuantity, cart } = useLocalShoppingCart()

	const [loadingCartOp, setLoadingCartOp] = useState(false)

	// Extrai dados do produto
	const item = useMemo(() => product?.items?.[0], [product])

	const sellerDefault = useMemo(() => {
		if (!item?.sellers?.length) return null
		return item.sellers.find(seller => seller.sellerDefault) || item.sellers[0]
	}, [item])

	// Verifica se o produto tem dados válidos
	const isValidProduct = Boolean(item && sellerDefault)

	// Gerencia item no carrinho
	const itemInCart = useCartItem(cart, item?.itemId)
	const itemQuantity = itemInCart?.quantity || 1

	// Gerencia wishlist
	const wishlist = useWishlist(product?.productId)

	// Valores derivados e formatados
	const productData = useMemo(() => {
		if (!isValidProduct) return null

		return {
			name: product.productName,
			image: item.images?.[0]?.imageUrl || '',
			video: getProductVideo(product),
			badge: calculateBadge(sellerDefault),
			listPrice: getFormattedListPrice(sellerDefault),
			price: formatPrice(sellerDefault.commertialOffer.Price),
			installments: formatInstallments(sellerDefault)
		}
	}, [product, item, sellerDefault, isValidProduct])

	// ========== Ações do Carrinho ==========

	const handleAddToCart = useCallback(async () => {
		if (!item || loadingCartOp) return

		try {
			setLoadingCartOp(true)
			await addItem({ ...item, quantity: itemQuantity })
		} catch (error) {
			console.error('Error adding to cart:', error)
		} finally {
			setLoadingCartOp(false)
		}
	}, [item, itemQuantity, loadingCartOp, addItem])

	const handleRemoveFromCart = useCallback(async () => {
		if (!itemInCart || loadingCartOp) return

		try {
			setLoadingCartOp(true)
			await removeItem(itemInCart.index)
		} catch (error) {
			console.error('Error removing from cart:', error)
		} finally {
			setLoadingCartOp(false)
		}
	}, [itemInCart, loadingCartOp, removeItem])

	const handleQuantityChange = useCallback(
		async newQuantity => {
			if (loadingCartOp) return

			if (newQuantity === 0) {
				return handleRemoveFromCart()
			}

			if (!itemInCart) return

			try {
				setLoadingCartOp(true)
				await updateItemQuantity(itemInCart.index, newQuantity)
			} catch (error) {
				console.error('Error updating quantity:', error)
			} finally {
				setLoadingCartOp(false)
			}
		},
		[itemInCart, loadingCartOp, updateItemQuantity, handleRemoveFromCart]
	)

	// ========== Ações de Navegação ==========

	const handleCardPress = useCallback(() => {
		openProduct(product)
	}, [product])

	const handleWishlistPress = useCallback(() => {
		wishlist.toggle(item?.name, item?.itemId)
	}, [wishlist, item])

	const handleCartButtonPress = useCallback(() => {
		if (loadingCartOp) return

		if (itemInCart) {
			openCart()
			return
		}

		const buyGoesToPDP = App?.configs?.appConfigs?.productCard?.buyGoesToPDP
		if (buyGoesToPDP) {
			openProduct(product)
			return
		}

		handleAddToCart()
	}, [loadingCartOp, itemInCart, product, handleAddToCart])

	// ========== Renderização ==========

	// Retorna null se o produto for inválido
	if (!isValidProduct || !productData) {
		return null
	}

	// Monta os parâmetros para o componente de apresentação
	const params = {
		name: productData.name,
		image: productData.image,
		video: productData.video,
		badge: productData.badge,
		listPrice: productData.listPrice,
		showListItem: App?.configs?.appConfigs?.productCard?.showListPrice ?? true,
		price: productData.price,
		installments: productData.installments,
		isInCart: Boolean(itemInCart),
		isOnWishlist: wishlist.isOnWishlist,
		loadingWishlistOp: wishlist.loading,
		loadingCartOp,
		itemQuantity,
		actionLabel: itemInCart ? 'Ver carrinho' : 'Comprar',
		onPressOnCard: handleCardPress,
		onPressCartButton: handleCartButtonPress,
		onPressOnWishlist: handleWishlistPress,
		onChangeQuantity: handleQuantityChange,
		t,
		className
	}

	// Seleciona a implementação do card baseado na config
	const implementations = {
		fullImage: ProductCardFullImage,
		default: ProductCardDefault
	}

	const cardStyle = App?.configs?.appConfigs?.productCard?.style
	const Implementation = implementations[cardStyle] || ProductCardDefault

	return React.createElement(Implementation, params)
}
