export const formatAmountInCents = (amount, locale='pt-BR', currency='BRL') => {
	if (typeof amount !== 'number') {
		return ''
	}
	if (amount === 0) {
		return 'Grátis'
	}
	return (amount / 100).toLocaleString(locale, { style: 'currency', currency: currency })
}

export const calculateDiscount = (initialValue, currencyValue) => {
	if (
		typeof initialValue === 'number' &&
		typeof currencyValue === 'number' &&
		currencyValue !== 0 &&
		initialValue > currencyValue
	) {
		const discountPrice = initialValue - currencyValue
		const discount = (discountPrice / initialValue) * 100
		return parseInt(discount)
	}
	return 0
}

export const formatDate = date => {
	return new Date(date).toLocaleDateString('pt-br')
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
