import { App } from 'eitri-shopping-vtex-shared'

export const formatPrice = (price, _locale, _currency) => {
	if (!price) return ''

	const locale = _locale || App?.configs?.storePreferences?.locale || 'pt-BR'
	const currency = _currency || App?.configs?.storePreferences?.currencyCode || 'BRL'

	return price.toLocaleString(locale, { style: 'currency', currency: currency })
}
