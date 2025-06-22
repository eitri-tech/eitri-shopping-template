import Eitri from 'eitri-bifrost'

export const requestLogin = () => {
	return new Promise((resolve, reject) => {
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'RequestLogin' }
		})
		Eitri.navigation.setOnResumeListener(resolve)
	})
}

export const closeEitriApp = () => {
	Eitri.navigation.close()
}

export const goHome = () => {
	Eitri.exposedApis.appState.goHome()
}

export const openAccount = async (product) => {
	try {
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'OrderList' }
		})
	} catch (e) {
		console.error('navigate to cart: Error trying to open cart', e)
	}
}
