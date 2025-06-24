export const getShippingAddress = cart => {
	// Pega o primeiro, todos entregam no mesmo lugar
	const firstLogisticInfo = cart?.shippingData?.logisticsInfo?.[0]

	if (!firstLogisticInfo) return null

	const isPickup = firstLogisticInfo.selectedDeliveryChannel === 'pickup-in-point'

	if (isPickup) return null

	const addressId = firstLogisticInfo?.addressId
	const addresses = cart?.shippingData?.availableAddresses
	const currentAddress = addresses?.find(address => address.addressId === addressId)

	if (!currentAddress) return null

	return {
		...currentAddress,
		formattedAddress: `${currentAddress?.street}, ${currentAddress?.number === null ? 's/n' : currentAddress?.number}${
			currentAddress?.complement ? ` - ${currentAddress?.complement}` : ''
		}`,
		isPickUp: false
	}
}
