import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'

let STORE_PREFERENCES

export const getStorePreferences = (page, state = {}, replace = false) => {
	if (STORE_PREFERENCES) {
		return STORE_PREFERENCES
	}
	return new Promise((resolve, reject) => {
		Eitri.environment
			.getRemoteConfigs()
			.then(conf => {
				resolve(conf?.storePreferences || {})
			})
			.catch(e => {
				reject(e)
			})
	})
}

export const getLoginProviders = async () => {
	return await Vtex.store.getLoginProviders()
}
