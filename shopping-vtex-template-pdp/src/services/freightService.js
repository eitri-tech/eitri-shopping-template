import { cartShippingResolver } from './cartShippingResolver'
import { Vtex } from 'eitri-shopping-vtex-shared'

export default async function fetchFreight(zipCode, currentSku) {
	if (!zipCode) {
		return
	}

	try {
		const address = await Vtex.checkout.resolveZipCode(zipCode)
		const { postalCode, city, state, street, neighborhood, country, geoCoordinates } = address

		let cartSimulationPayload
		let result

		cartSimulationPayload = {
			items: [
				{
					id: currentSku?.itemId,
					quantity: '1',
					seller: currentSku?.sellers[0]?.sellerId
				}
			],
			shippingData: {
				selectedAddresses: [
					{
						addressType: '',
						receiverName: '',
						addressId: '',
						isDisposable: true,
						postalCode: postalCode,
						city: city,
						state: state,
						country: country,
						street: street,
						number: null,
						neighborhood: neighborhood,
						complement: null,
						reference: null,
						geoCoordinates: geoCoordinates
					}
				]
			}
		}

		result = await Vtex.cart.simulateCart(cartSimulationPayload)

		const cannotBeDelivered = result?.messages?.find(item => item.code === 'cannotBeDelivered')

		if (cannotBeDelivered) {
			return []
		}

		return cartShippingResolver({
			shippingData: {
				address: true,
				logisticsInfo: result?.logisticsInfo ? result.logisticsInfo : result?.data?.shipping?.logisticsInfo,
				messages: result?.messages || ''
			}
		})
	} catch (error) {
		console.error('Error fetching freight', error)
	}
}
