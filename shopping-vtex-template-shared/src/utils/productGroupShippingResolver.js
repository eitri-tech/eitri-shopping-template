import {
	addDaysToDate,
	addHoursToDate,
	addMinutesToDate,
	formatAmountInCents,
	formatDate,
	formatShippingEstimate
} from './utils'

export default function productGroupShippingResolver(cart) {
	try {
		if (!cart?.shippingData?.logisticsInfo) {
			return null
		}

		const groupedByProduct = groupProductsBySlas(cart.shippingData.logisticsInfo)

		// console.log('groupedByProduct==>', groupedByProduct)

		const withProducts = groupedByProduct?.map(group => {
			return {
				...group,
				items: group?.items.map(item => {
					return {
						...item,
						itemIndex: item?.itemIndex,
						name: cart?.items[item?.itemIndex]?.name,
						quantity: cart?.items[item?.itemIndex]?.quantity,
						imageUrl: cart?.items[item?.itemIndex]?.imageUrl
					}
				})
			}
		})

		const richData = enrichedData(withProducts)

		return richData
	} catch (error) {
		console.error('Error on cartShippingResolver', error)

		throw error
	}
}

// Função para criar uma chave única baseada nos IDs dos SLAs
function createSlaKey(slas) {
	return slas
		.map(sla => sla.id)
		.sort()
		.join('|')
}

// Função principal para agrupar produtos por SLAs
function groupProductsBySlas(logisticsInfo) {
	const groups = new Map()

	logisticsInfo.forEach(item => {
		const slaKey = createSlaKey(item.slas)

		if (!groups.has(slaKey)) {
			groups.set(slaKey, {
				slas: item.slas.map(sla => ({
					...sla,
					totalPrice: 0
				})),
				items: []
			})
		}

		const group = groups.get(slaKey)

		// Adiciona o preço de cada SLA ao total
		group.slas.forEach((sla, index) => {
			sla.totalPrice += item.slas[index].price
		})

		group.items.push({
			itemIndex: item.itemIndex,
			itemId: item.itemId,
			selectedSla: item.selectedSla,
			selectedDeliveryChannel: item.selectedDeliveryChannel
		})
	})

	return Array.from(groups.values())
}

const enrichedData = groups => {
	return groups.map(group => {
		return {
			...group,
			currentSla: group?.items?.every(i => i.selectedSla === group?.items?.[0].selectedSla)
				? group?.items?.[0].selectedSla
				: '',
			slas: group.slas.map(sla => {
				return {
					...sla,
					isPickupInPoint: sla.deliveryChannel === 'pickup-in-point',
					formatedShippingEstimate: formatShippingEstimate(sla),
					formattedTotalPrice: group.totalPrice === 0 ? 'Grátis' : formatAmountInCents(sla.totalPrice)
				}
			})
		}

		const address = group.isPickupInPoint
			? JSON.parse(JSON.stringify(group.pickupStoreInfo?.address))
			: cart?.shippingData?.selectedAddresses?.find(address => address.addressId === group.addressId)
		const pickUpStorePoint = cart?.shippingData?.pickupPoints?.find(point => point.id === group.pickupPointId)

		return {
			...group,
			name: group.isPickupInPoint ? group.pickupStoreInfo?.friendlyName : group.name,
			price: group.price === 0 ? 'Grátis' : formatAmountInCents(group.price),
			fulfillsAllItems: group?.slas?.length === cart.items.length,
			isCurrent:
				group?.slas?.length === cart.items.length &&
				cart.shippingData?.logisticsInfo?.every(logistic => logistic.id === group.id),
			address: address ? JSON.parse(JSON.stringify(address)) : null,
			businessHours: pickUpStorePoint?.businessHours,
			products: group.slas.map(sla => {
				return {
					itemIndex: sla.itemIndex,
					name: cart?.items[sla.itemIndex]?.name,
					quantity: cart?.items[sla.itemIndex]?.quantity,
					imageUrl: cart?.items[sla.itemIndex]?.imageUrl
				}
			})
		}
	})
}

const shippingEstimateDate = shippingEstimate => {
	const isHours = shippingEstimate.indexOf('h') > -1
	const isMinutes = shippingEstimate.indexOf('m') > -1
	const useBd = shippingEstimate.indexOf('bd') > -1
	const value = parseInt(shippingEstimate)

	if (isMinutes) {
		return addMinutesToDate(value)
	}

	if (isHours) {
		return addHoursToDate(value)
	}

	return addDaysToDate(value, useBd)
}
