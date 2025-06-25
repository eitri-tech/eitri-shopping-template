import { Tracking } from 'eitri-shopping-vtex-shared'

export const sendPageView = async pageName => {
	try {
		Tracking.ga.logScreenView(pageName)
	} catch (e) {
		console.error('Erro ao enviar pageView', e)
	}
}

export const logEvent = async (eventName, eventData) => {
	try {
		Tracking.ga.logEvent(eventName, eventData)
	} catch (e) {
		console.error('Erro ao enviar evento', e)
	}
}
