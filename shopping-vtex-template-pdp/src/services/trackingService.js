import Eitri from 'eitri-bifrost'
import { Tracking } from 'shopping-vtex-template-shared'

export const sendViewItem = async product => {
	const _item = product.items[0]
	const categories = product.categories[0]
		?.split('/')
		?.filter(Boolean)
		?.reduce((acc, curr, index) => {
			if (index === 0) {
				acc[`item_category`] = curr
			} else {
				acc[`item_category${index + 1}`] = curr
			}
			return acc
		}, {})

	const item = {
		currency: 'BRL',
		value: 30.03,
		items: [
			{
				item_id: _item.itemId,
				item_name: _item.name,
				item_brand: product.brand,
				...categories,
				price: _item.sellers[0].Price
			}
		]
	}

	Tracking.ga.event('view_item', item)
}

export const setScreenView = async (screenName, screenClass = null) => {
	try {
		if (Eitri.exposedApis?.fb) {
			await Eitri.exposedApis.fb.currentScreen({ screen: screenName, screenClass: screenClass || screenName })
		}
	} catch (error) {
		console.log('Erro ao setar tela atual', error)
	}
}

export const logEvent = async (eventName, data) => {
	try {
		if (Eitri.exposedApis?.fb) {
			await Eitri.exposedApis.fb.logEvent({ eventName, data })
		}
	} catch (error) {
		console.log('Erro ao logar evento', error)
	}
}

export const crashLog = async message => {
	try {
		if (Eitri.exposedApis?.fb) {
			await Eitri.exposedApis.fb.crashLog({ message })
		}
	} catch (error) {
		console.log('Erro ao logar evento', error)
	}
}

export const crash = async () => {
	try {
		if (Eitri.exposedApis?.fb) {
			await Eitri.exposedApis.fb.crash()
		}
	} catch (error) {
		console.log('Erro ao logar evento', error)
	}
}
