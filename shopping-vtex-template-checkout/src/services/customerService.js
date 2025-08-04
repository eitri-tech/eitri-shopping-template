import { Vtex } from 'eitri-shopping-vtex-shared'
import Eitri from 'eitri-bifrost'

export const saveUserEmailOnStorage = async email => {
	return await Vtex.customer.setCustomerData('email', email)
}

export const loadUserEmailFromStorage = async () => {
	return await Vtex.customer.getCustomerData('email')
}

export const requestLogin = () => {
	return new Promise(async (resolve, reject) => {
		if (await isLoggedIn()) {
			resolve()
			return
		}

		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'RequestLogin', closeAppAfterLogin: true }
		})

		Eitri.navigation.setOnResumeListener(async () => {
			if (await isLoggedIn()) {
				resolve()
			} else {
				reject('User not logged in')
			}
		})
	})
}

export const isLoggedIn = async () => {
	try {
		return await Vtex.customer.isLoggedIn()
	} catch (e) {
		console.error('Erro ao buscar dados do cliente', e)
		return false
	}
}
