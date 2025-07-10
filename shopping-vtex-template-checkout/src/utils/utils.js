import { App } from 'eitri-shopping-vtex-shared'
import Eitri from 'eitri-bifrost'

export const formatAmount = price => {
	if (!price) return ''

	const locale = App?.configs?.storePreferences?.locale || 'pt-BR'
	const currency = App?.configs?.storePreferences?.currencyCode || 'BRL'

	return price.toLocaleString(locale, { style: 'currency', currency: currency })
}

export const formatAmountInCents = amount => {
	if (typeof amount !== 'number') {
		return ''
	}
	if (amount === 0) {
		return 'Grátis'
	}
	return formatAmount(amount / 100)
}

export const hideCreditCardNumber = text => {
	return '****.****.****.' + text.slice(12)
}

export const formatDate = date => {
	return new Date(date).toLocaleDateString('pt-br')
}

let cartmantCountdown = 7
export const goToCartman = () => {
	if (cartmantCountdown === 0) {
		Eitri.navigation.navigate({ path: 'Cartman' })
		cartmantCountdown = 7
	} else {
		cartmantCountdown--
	}
}
