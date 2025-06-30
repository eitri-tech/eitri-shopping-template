import { cartShippingResolver } from 'shopping-vtex-template-shared'

import { calculateDiscount, formatAmountInCents } from '../utils/utils'

export default function adaptCart(cart) {
	if (!cart) return null
	const cartFinalValue = calculateCartFinalValue(cart)

	const giftCardsValue = cart.paymentData?.giftCards?.reduce((acc, giftCard) => acc + giftCard.value, 0) ?? 0

	return {
		...cart,
		orderFormId: cart.orderFormId,
		loggedIn: cart.loggedIn,
		canEditData: cart.canEditData,
		value: cartFinalValue,
		formattedValue: formatAmountInCents(cartFinalValue),
		valueWithoutDiscount: cart.value,
		formattedValueWithoutDiscount: formatAmountInCents(cart.value),
		items: processItems(cart.items, cart.sellers, cart.messages),
		shipping: cartShippingResolver(cart),
		clientProfileData: JSON.parse(JSON.stringify(cart.clientProfileData)),
		isReadyToPay: validatePaymentReady(cart),
		payOnlyInGiftCard: giftCardsValue >= cart.value,
		giftCardValue: giftCardsValue,
		formattedGiftCardValue: (giftCardsValue / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }),
		paymentSystems: processPaymentSystems(cart),
		payments: cart.paymentData?.payments.map(payment => {
			const paymentSystem = cart.paymentData?.paymentSystems?.find(ps => ps.stringId === payment.paymentSystem)
			return {
				name: paymentSystem?.name,
				groupName: paymentSystem?.groupName,
				...payment
			}
		}),
		giftCards: cart.paymentData?.giftCards?.map(giftCard => {
			return {
				...giftCard,
				formattedValue: formatAmountInCents(giftCard.value)
			}
		}),
		totalizers: cart.totalizers?.map(totalizer => {
			return {
				id: totalizer.id,
				value: totalizer.value,
				name: totalizer.name,
				formattedValue: formatAmountInCents(totalizer.value)
			}
		}),
		messages: cart.messages,
		marketingData: cart.marketingData
	}
}

function processItems(items, sellers, messages) {
	const findSellerName = itemSellerId => {
		const seller = sellers?.find(s => s.id === itemSellerId)
		return seller?.name || ''
	}

	const findMessage = itemEan => {
		return messages?.find(m => m.fields?.ean === itemEan)
	}

	return items.map((item, index) => {
		const message = findMessage(item.ean)

		return {
			...item,
			itemIndex: index,
			id: item.id,
			productId: item.productId,
			ean: item.ean,
			name: item.name,
			skuName: item.skuName,
			price: item.sellingPrice,
			formattedPrice: formatAmountInCents(item.sellingPrice),
			total: item.priceDefinition?.calculatedSellingPrice,
			formattedTotal: formatAmountInCents(item.priceDefinition?.calculatedSellingPrice),
			listPrice: item.listPrice,
			formattedListPrice: formatAmountInCents(item.formattedListPrice),
			productCategoryIds: item.productCategoryIds,
			productCategories: item.productCategories,
			discount: calculateDiscount(item.listPrice, item.sellingPrice),
			quantity: item.quantity,
			seller: item.seller,
			sellerName: findSellerName(item.seller),
			imageUrl: item.imageUrl?.replace('http:', 'https:'),
			message: message?.text || '',
			cannotBeDelivered: item.availability === 'cannotBeDelivered',
			available: item.availability === 'available' ? true : false,
			unavailableReason: (() => {
				if (item.availability === 'available' && message?.code !== 'cannotBeDelivered') {
					return ''
				}
				if (item.availability === 'cannotBeDelivered') {
					return 'Produto não pode ser entregue nesse CEP'
				}

				return item.availability !== 'available' ? 'Produto indisponível' : 'Produto não pode ser entregue'
			})(),
			maxQuantityReach: message?.code === 'itemQuantityNotAvailable',
			offerings: item.offerings?.map(offering => {
				return {
					...offering,
					formattedPrice: formatAmountInCents(offering.price),
					isBundled: item.bundleItems?.some(b => b.id === offering.id)
				}
			})
		}
	})
}

function processPaymentSystems(cart) {
	const paymentData = JSON.parse(JSON.stringify(cart.paymentData))

	return paymentData?.paymentSystems?.reduce((acc, paymentSystem) => {
		const group = acc?.find(group => group.groupName === paymentSystem.groupName)

		const installments = paymentData.installmentOptions?.find(
			installment => installment.paymentSystem === paymentSystem.stringId
		)

		const isCurrentPaymentSystem = paymentData?.payments?.some(
			payment => payment.paymentSystem === paymentSystem.stringId
		)

		if (group) {
			group.isCurrentPaymentSystemGroup = isCurrentPaymentSystem
			group.paymentSystems.push({
				...paymentSystem,
				isCurrentPaymentSystem: isCurrentPaymentSystem,
				installments: installments?.installments.map(installment => ({
					...installment,
					label: `${installment.count}x de ${formatAmountInCents(
						installment.value
					)} (total: ${formatAmountInCents(installment.total)})`,
					formattedValue: formatAmountInCents(installment.value)
				}))
			})
		} else {
			acc.push({
				groupName: paymentSystem.groupName,
				isCurrentPaymentSystemGroup: isCurrentPaymentSystem,
				paymentSystems: [
					{
						...paymentSystem,
						isCurrentPaymentSystem: isCurrentPaymentSystem,
						installments: installments?.installments.map(installment => ({
							...installment,
							formattedValue: formatAmountInCents(installment.value)
						}))
					}
				]
			})
		}

		return acc
	}, [])
	// console.log(KNOW_PAYMENTS_GROUPS)
}

function validatePaymentReady(cart) {
	const giftCardsValue = cart.paymentData?.giftCards?.reduce((acc, giftCard) => acc + giftCard.value, 0) ?? 0

	return (
		(cart.paymentData?.payments?.length > 0 || giftCardsValue >= cart.value) &&
		cart.clientProfileData?.email &&
		cart.shippingData?.address
	)
}

function calculateCartFinalValue(cart) {
	const value = cart.value
	const giftCardValue =
		cart?.paymentData?.giftCards?.length > 0
			? cart?.paymentData?.giftCards?.reduce((acc, giftCard) => acc + giftCard.value, 0)
			: 0
	return value - giftCardValue
}
