import { App } from 'eitri-shopping-vtex-shared'

export const startConfigure = async () => {
	await App.tryAutoConfigure({ verbose: true, gaVerbose: false })
}

export const setLanguage = i18n => {
	try {
		const preferredLang = App?.configs?.storePreferences?.locale
		if (!preferredLang) return
		i18n.changeLanguage(preferredLang)
	} catch (e) {
		console.error('Erro ao setar idioma', e)
	}
}
