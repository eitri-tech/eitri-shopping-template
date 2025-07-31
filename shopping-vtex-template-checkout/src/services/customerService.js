import { Vtex } from 'eitri-shopping-vtex-shared'

export const saveUserEmailOnStorage = async email => {
	return await Vtex.customer.setCustomerData('email', email)
}

export const loadUserEmailFromStorage = async () => {
	return await Vtex.customer.getCustomerData('email')
}
