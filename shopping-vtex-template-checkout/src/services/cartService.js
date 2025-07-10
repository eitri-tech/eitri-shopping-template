import { Vtex } from 'eitri-shopping-vtex-shared'
import Eitri from 'eitri-bifrost'

export const getCart = async () => {
	return await Vtex.cart.getCartIfExists()
}

export const startPayment = async (cart, cardInfo, recaptchaToken, siteKey) => {
	try {
		const result = await Vtex.checkout.pay(cart, cardInfo, recaptchaToken, siteKey)

		return result
	} catch (error) {
		console.log('Erro ao iniciar pagamento', error)
	}
}

export const getUserByEmail = async email => {
	return await Vtex.cart.getClientProfileByEmail(email)
}

export const saveCartIdOnStorage = async orderFormId => {
	return await Vtex.cart.saveCartIdOnStorage(orderFormId)
}

export const addUserData = async userData => {
	const newCart = await Vtex.checkout.addUserData(userData)
	return newCart
}

export const selectPaymentOption = async payload => {
	const newCart = await Vtex.checkout.selectPaymentOption(payload)
	return newCart
}

export const clearCart = async () => {
	await Vtex.cart.clearCart()
}

export const removeClientData = async () => {
	await Vtex.cart.removeClientData()
	return await getCart()
}

export const registerToNotify = async userProfileId => {
	try {
		Eitri.exposedApis.session.notifyLogin({ customerId: userProfileId })
	} catch (e) {
		console.log('erro on registerToNotify', e)
	}
}
