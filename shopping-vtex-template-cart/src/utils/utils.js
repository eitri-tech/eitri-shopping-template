import { App } from 'eitri-shopping-vtex-shared'

export const formatAmountInCents = (amount, _locale, _currency) => {
	if (typeof amount !== 'number') {
		return ''
	}
	if (amount === 0) {
		return 'Free'
	}

	const locale = _locale || App?.configs?.storePreferences?.locale || 'pt-BR'
	const currency = _currency || App?.configs?.storePreferences?.currencyCode || 'BRL'
	return (amount / 100).toLocaleString(locale, { style: 'currency', currency: currency })
}

export const formatDate = date => {
	return new Date(date).toLocaleDateString('pt-br')
}
