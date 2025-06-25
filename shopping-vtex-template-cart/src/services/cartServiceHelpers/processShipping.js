import { addDaysToDate, formatAmountInCents, formatDate } from '../../utils/utils'

export default function processShipping(cart) {
	try {
		const address = cart.shippingData?.address

		if (!address) {
			return null
		}

		const logisticsInfo = cart.shippingData?.logisticsInfo

		const preProcessedLogisticInfos = preProcessingSla(logisticsInfo)

		const logInfoWithFasterAndCheaperSla = mapFasterAndCheaperShippingOption(preProcessedLogisticInfos)

		const { cheapers, fasters } = getCheapersAndFasters(logInfoWithFasterAndCheaperSla)

		const isCheaperAndFasterTheSame = cheapers.every(cheaper => cheaper.isFaster)

		const options = []

		if (cheapers.length === 0 && fasters.length === 0) {
			options.push({
				label: 'Indisponível para entrega',
				shippingEstimate: '',
				price: '',
				slas: [],
				isCurrent: false
			})
		} else {
			if (isCheaperAndFasterTheSame) {
				options.push({
					label: 'Entrega econômica',
					shippingEstimate: `Receba até ${getMaximumDeliveryDate(cheapers)}`,
					price: getFormattedTotalPrice(cheapers),
					slas: cheapers,
					isCurrent: cheapers.every(cheaper => cheaper.selected)
				})
			} else {
				options.push({
					label: 'Entrega econômica',
					shippingEstimate: `Receba até ${getMaximumDeliveryDate(cheapers)}`,
					price: getFormattedTotalPrice(cheapers),
					slas: cheapers,
					isCurrent: cheapers.every(cheaper => cheaper.selected)
				})
				options.push({
					label: 'Mais rápida',
					shippingEstimate: `Receba até ${getMaximumDeliveryDate(fasters)}`,
					price: getFormattedTotalPrice(fasters),
					slas: fasters,
					isCurrent: fasters.every(faster => faster.selected)
				})
			}
		}

		const grouped = deliveriesGroups(preProcessedLogisticInfos)

		const shipping = {
			postCode: cart.shippingData?.address?.postalCode,
			summary: formatSummary(grouped),
			shippingUnavailable: cheapers.length === 0 && fasters.length === 0,
			options
		}

		return shipping
	} catch (error) {
		console.error('Error on cartShippingResolver', error)

		throw error
	}
}

function getCheapersAndFasters(logInfoWithFasterAndCheaperSla) {
	const cheapers = []
	const fasters = []

	for (const sla of logInfoWithFasterAndCheaperSla) {
		const fasterSla = sla.slas.find(sla => sla.isFaster)
		const cheaperSla = sla.slas.find(sla => sla.isCheaper)

		if (fasterSla) {
			fasters.push({ itemIndex: sla.itemIndex, ...fasterSla })
		}

		if (cheaperSla) {
			cheapers.push({ itemIndex: sla.itemIndex, ...cheaperSla })
		}
	}

	return { cheapers, fasters }
}

function getFormattedTotalPrice(slas) {
	const total = slas.reduce((acc, current) => {
		return acc + current.price
	}, 0)

	return total === 0 ? 'Grátis' : formatAmountInCents(total)
}

function getMaximumDeliveryDate(slas) {
	const maximumDate = slas.reduce(
		(acc, current) => {
			return acc > current?.shippingEstimateDate ? acc : current.shippingEstimateDate
		},
		new Date(1970, 1, 1)
	)

	return formatDate(maximumDate)
}

function preProcessingSla(logisticsInfo) {
	const shippingEstimateDate = shippingEstimate => {
		const useBd = shippingEstimate.indexOf('bd') > -1
		const days = parseInt(shippingEstimate)

		return addDaysToDate(days, useBd)
	}

	return logisticsInfo.map(logistic => {
		return {
			itemIndex: logistic.itemIndex,
			selectedSla: logistic.selectedSla,
			selectedDeliveryChannel: logistic.selectedDeliveryChannel,
			slas: logistic.slas.map(sla => {
				const estimatedDate = shippingEstimateDate(sla.shippingEstimate)

				return {
					id: sla.id,
					price: sla.price,
					shippingEstimate: sla.shippingEstimate,
					shippingEstimateDate: estimatedDate,
					formattedShippingEstimate: formatDate(estimatedDate),
					deliveryChannel: sla.deliveryChannel,
					selected:
						sla.id === logistic.selectedSla && sla.deliveryChannel === logistic.selectedDeliveryChannel,
					courierId: sla.deliveryIds[0].courierId,
					warehouseId: sla.deliveryIds[0].warehouseId,
					dockId: sla.deliveryIds[0].dockId,
					courierName: sla.deliveryIds[0].courierName
				}
			})
		}
	})
}

function mapFasterAndCheaperShippingOption(preProcessedSlas) {
	const _preProcessedSlas = []

	for (const preProcessedSla of preProcessedSlas) {
		const { slas } = preProcessedSla

		let fasterSla = { shippingEstimateDate: new Date(2199, 1, 1), price: Infinity }
		let cheaperSla = { shippingEstimateDate: new Date(2199, 1, 1), price: Infinity }

		// Considera que para a comparação de datas, o horário é sempre o mesmo. Isso pq a data a formatada assim no utils.js
		for (const sla of slas) {
			if (
				fasterSla.shippingEstimateDate > sla.shippingEstimateDate ||
				(fasterSla.shippingEstimateDate === sla.shippingEstimateDate && fasterSla.price > sla.price)
			) {
				fasterSla = sla
			}
			if (
				cheaperSla.price > sla.price ||
				(cheaperSla.price === sla.price && cheaperSla.shippingEstimateDate > sla.shippingEstimateDate)
			) {
				cheaperSla = sla
			}
		}

		_preProcessedSlas.push({
			...preProcessedSla,
			slas: preProcessedSla.slas.map(sla => {
				return {
					...sla,
					isFaster: sla.id === fasterSla.id && sla.deliveryChannel === fasterSla.deliveryChannel,
					isCheaper: sla.id === cheaperSla.id && sla.deliveryChannel === cheaperSla.deliveryChannel
				}
			})
		})
	}

	return _preProcessedSlas
}

function deliveriesGroups(preProcessedSla) {
	const grouped = preProcessedSla.reduce((acc, current) => {
		const selectedSla = current.slas.find(sla => sla.selected)
		const _docker = acc.find(docker => {
			return (
				docker?.dockId === selectedSla?.dockId &&
				docker?.shippingEstimate === selectedSla?.shippingEstimate &&
				docker?.courierId === selectedSla?.courierId
			)
		})
		if (_docker) {
			_docker.count += 1
			_docker.price += selectedSla?.price
		} else {
			acc.push({
				dockId: selectedSla?.dockId,
				shippingEstimate: selectedSla?.shippingEstimate,
				shippingEstimateDate: selectedSla?.shippingEstimateDate,
				formattedShippingEstimate: selectedSla?.formattedShippingEstimate,
				courierId: selectedSla?.courierId,
				price: selectedSla?.price,
				count: 1
			})
		}

		return acc
	}, [])
	return grouped
}

function formatSummary(grouped) {
	if (grouped.length === 1) {
		return ''
	}

	grouped.sort((a, b) => {
		return a.shippingEstimateDate - b.shippingEstimateDate
	})

	const dates = grouped.map(group => `até dia ${group.formattedShippingEstimate}`)

	return `${grouped.length} pacotes: ${dates.join(', ')}`
}
