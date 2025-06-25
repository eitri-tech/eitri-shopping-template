import { App } from 'eitri-shopping-vtex-shared'

export const formatAmount = (amount, _locale, _currency) => {
	if (typeof amount !== 'number') {
		return ''
	}

	const locale = _locale || App.configs?.storePreferences?.locale || 'pt-BR'
	const currency = _currency || App.configs?.storePreferences?.currencyCode || 'BRL'

	return amount.toLocaleString(locale, { style: 'currency', currency: currency })
}

export const formatAmountInCents = amount => {
	if (typeof amount !== 'number') {
		return ''
	}
	if (amount === 0) {
		return 'Grátis'
	}
	return (amount / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

export const formatDateDaysMonthYear = date => {
	const data = new Date(date)
	const dia = data.getDate()
	const mes = data.toLocaleString('pt-BR', { month: 'long' })
	const ano = data.getFullYear()
	return `${dia} de ${mes} de ${ano}`
}

export const formatDate = date => {
	return new Date(date).toLocaleDateString('pt-br')
}

export const formatZipCode = zipCode => {
	if (!zipCode) return ''
	if (zipCode.includes('-')) return zipCode
	return zipCode.slice(0, 5) + '-' + zipCode.slice(5)
}

export const addDaysToDate = (daysToAdd, onlyBusinessDays = true) => {
	let currentDate = new Date()

	currentDate.setHours(12)
	currentDate.setMinutes(0)
	currentDate.setSeconds(0)
	currentDate.setMilliseconds(0)

	let count = 0
	while (count < daysToAdd) {
		currentDate.setDate(currentDate.getDate() + 1)
		// Check if it's not a weekend (Saturday: 6, Sunday: 0)
		if (!onlyBusinessDays || (currentDate.getDay() !== 0 && currentDate.getDay() !== 6)) {
			count++
		}
	}
	return currentDate
}

export const formatPhoneNumber = phoneNumber => {
	return phoneNumber.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export const formatDocument = document => {
	switch (`${document}`.length) {
		case 11:
			return document.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
		case 14:
			return document.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
		case 12:
			return document.replace(/(\d{2})(\d{4})(\d{4})(\d{2})/, '$1.$2.$3/$4')
	}
}

export const parseJwt = token => {
	try {
		return JSON.parse(atob(token.split('.')[1]))
	} catch (e) {
		return null
	}
}

export const upperCaseWord = string => {
	return string?.charAt(0).toUpperCase() + string?.slice(1)
}
