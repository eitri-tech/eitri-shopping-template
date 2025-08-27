import { TrackingService } from 'shopping-vtex-template-shared'
import { extractUniqueCategoryNames } from '../utils/utils'
import Eitri from 'eitri-bifrost'

export const trackScreenView = (friendlyScreenName, screenFileName) => {
	try {
		TrackingService.screenView(friendlyScreenName, screenFileName)
	} catch (e) {
		console.log('Error on trackScreenView', e)
	}
}

export const trackBeginCheckout = cart => {
	try {
		const totalizer = cart?.totalizers?.find(i => i.id === 'Items')
		const value = totalizer?.value ? totalizer.value / 100 : cart.value ? cart.value / 100 : ''

		TrackingService.event('begin_checkout', {
			currency: 'BRL',
			value: value,
			coupon: cart.marketingData?.coupon || '',
			items: cart.items.map(item => ({
				item_id: item.productId,
				item_name: item.name || item.productName || item.nameComplete,
				price: item.price ? item.price / 100 : '',
				quantity: item.quantity
			}))
		})

		TrackingService.inngageEvent('begin_checkout', {
			currency: 'BRL',
			value: value,
			coupon: cart.marketingData?.coupon || '',
			items: cart.items
				.map(item => `${item.productId}-${item.name || item.productName || item.nameComplete}`)
				.join(',')
		})

		TrackingService.appsFlyerEvent('af_initiated_checkout', {
			af_currency: 'BRL',
			af_price: value,
			af_content_id: cart.items.map(item => `${item.productId}`),
			af_content_type: extractUniqueCategoryNames(cart),
			af_quantity: cart.items.map(item => item.quantity)
		})
	} catch (e) {
		console.log('Error on tracking', e)
	}
}

export const trackAddPaymentInfo = (cart, paymentType) => {
	try {
		const totalizer = cart?.totalizers?.find(i => i.id === 'Items')
		const value = totalizer?.value ? totalizer.value / 100 : cart.value ? cart.value / 100 : ''

		TrackingService.event('add_payment_info', {
			currency: 'BRL',
			payment_type: paymentType || '',
			value: value,
			items: cart.items.map(item => ({
				item_id: item.productId,
				item_name: item.name || item.productName || item.nameComplete,
				price: item.price ? item.price / 100 : ''
			}))
		})

		TrackingService.inngageEvent('add_payment_info', {
			currency: 'BRL',
			payment_type: paymentType || ''
		})
	} catch (e) {
		console.log('Error on tracking', e)
	}
}

export const sendLogError = async (error, orderId, userId, email, method) => {
	try {
		const environment = await Eitri.environment.getName()
		if (environment === 'dev') return

		const payload = {
			origin: 'APP-SHOPPING',
			eventName: `${window.__eitriAppConf?.slug}-error`,
			data: {
				app: 'checkout',
				applicationId: window.__eitriAppConf?.applicationId,
				method: method || '',
				cartId: orderId || '',
				userEmail: email || '',
				error: {
					message: error?.response?.message || '',
					data: JSON.stringify(error?.response?.data || {})
				}
			},
			userId: userId || ''
		}

		Eitri.http.post('https://api.eitri.tech/analytics/event', payload, {
			'Content-Type': 'application/json',
			'application-id': window.__eitriAppConf?.applicationId
		})
	} catch (e) {
		console.error('Erro ao setar user', e)
	}
}
