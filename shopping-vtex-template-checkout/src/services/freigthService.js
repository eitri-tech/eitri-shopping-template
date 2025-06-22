import { Vtex } from 'eitri-shopping-vtex-shared'
import adaptCart from '../adapter/CartAdapter'

export default async function setFreight(cart, shippingOptions) {
	try {
		const newCart = await Vtex.checkout.setLogisticInfo({
			logisticsInfo: generateLogisticInfoPayload(cart?.address?.addressId, shippingOptions.slas),
			clearAddressIfPostalCodeNotFound: false,
			selectedAddresses: cart?.shipping?.selectedAddresses
		})

		return adaptCart(newCart)
	} catch (error) {
		console.error('setFreight', error)
	}
}

export const setNewAddress = async (cart, postalCode) => {
	try {
		const resultCep = await Vtex.cart.resolvePostalCode(postalCode)

		const { street, neighborhood, city, state, country, geoCoordinates } = resultCep

		const newCart = await Vtex.checkout.setLogisticInfo({
			clearAddressIfPostalCodeNotFound: false,
			selectedAddresses: generateSelectedAddressesPayload({
				postalCode,
				street,
				neighborhood,
				city,
				state,
				country,
				geoCoordinates
			})
		})

		return adaptCart(newCart)
	} catch (error) {
		console.error('getZipCode Error', error)
	}
}

export const updateAddress = async (cart, address) => {
	const selectedAddresses = generateSelectedAddressesPayload(address)
	const newCart = await Vtex.checkout.setLogisticInfo({
		logisticsInfo: cart?.shippingData?.logisticsInfo,
		clearAddressIfPostalCodeNotFound: false,
		selectedAddresses: selectedAddresses
	})

	return adaptCart(newCart)
}

const generateLogisticInfoPayload = (addressId, shippingOptions) => {
	return shippingOptions?.map(option => {
		return {
			addressId,
			itemIndex: option.itemIndex,
			selectedDeliveryChannel: option.deliveryChannel,
			selectedSla: option.id
		}
	})
}

const generateSelectedAddressesPayload = address => {
	const {
		addressType,
		addressId,
		postalCode,
		complement,
		number,
		street,
		neighborhood,
		city,
		state,
		country,
		geoCoordinates,
		receiverName,
		reference,
		isDisposable
	} = address

	return [
		{
			addressType: addressType || 'residential',
			receiverName,
			addressId,
			isDisposable: isDisposable,
			postalCode: postalCode,
			city: city,
			state: state,
			country: country,
			street: street,
			number: number,
			neighborhood: neighborhood,
			complement: complement,
			reference,
			geoCoordinates: geoCoordinates.map(coord => coord),
			addressQuery: ''
		},
		{
			addressType: 'search',
			receiverName,
			isDisposable: isDisposable,
			postalCode: postalCode,
			city: city,
			state: state,
			country: country,
			street: street,
			number: number,
			neighborhood: neighborhood,
			complement: complement,
			reference,
			geoCoordinates: geoCoordinates.map(coord => coord),
			addressQuery: ''
		}
	]
}
