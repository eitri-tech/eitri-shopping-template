export const formatAmountInCents = amount => {
	if (typeof amount !== 'number') {
		return ''
	}
	if (amount === 0) {
		return 'Grátis'
	}
	return (amount / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
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

export const addHoursToDate = hoursToAdd => {
	const currentDate = new Date()
	currentDate.setHours(currentDate.getHours() + hoursToAdd)
	return currentDate
}

export const addMinutesToDate = minutesToAdd => {
	const currentDate = new Date()
	currentDate.setMinutes(currentDate.getMinutes() + minutesToAdd)
	return currentDate
}

export const formatShippingEstimate = sla => {
	const shippingEstimate = sla.shippingEstimate
	let date = getShippingEstimate(sla)

	const isHours = shippingEstimate.indexOf('h') > -1
	const isMinutes = shippingEstimate.indexOf('m') > -1
	const useBd = shippingEstimate.indexOf('bd') > -1

	const value = parseInt(shippingEstimate)

	if (sla.deliveryChannel === 'pickup-in-point') {
		if (isHours) {
			const isSameDay =
				date.getFullYear() === new Date().getFullYear() &&
				date.getMonth() === new Date().getMonth() &&
				date.getDate() === new Date().getDate()

			if (isSameDay) {
				return `Retire hoje a partir de ${value} horas`
			}

			const isTomorrow =
				date.getFullYear() === new Date().getFullYear() &&
				date.getMonth() === new Date().getMonth() &&
				date.getDate() === new Date().getDate() + 1

			if (isTomorrow) {
				return `Retire amanhã`
			}
			//
			// console.log(
			// 	'date==>',
			// 	date.getFullYear() === new Date().getFullYear() &&
			// 		date.getMonth() === new Date().getMonth() &&
			// 		date.getDate() === new Date().getDate(),
			// 	date.toLocaleString('pt-BR', {
			// 		hour: '2-digit',
			// 		minute: '2-digit'
			// 	})
			// )

			// if (value === 1) {
			// 	return `Retire na loja após ${value} hora`
			// }
			return `Retire na loja após ${value} horas`
		}

		if (isMinutes) {
			return `Retire na loja após ${value} minutos`
		}

		if (useBd) {
			const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
			const day = date.getDate()
			const month = date.toLocaleDateString('pt-BR', { month: 'long' })

			// Se for até 7 dias úteis (aproximadamente 1 semana)
			if (value <= 7) {
				return `Retire até ${weekday}, ${day} de ${month}`
			} else {
				return `Retire após ${day} de ${month}`
			}
		}
	}

	// Para entregas normais (não pickup)
	if (useBd || (!isHours && !isMinutes)) {
		const weekday = date.toLocaleDateString('pt-BR', { weekday: 'long' })
		const day = date.getDate()
		const month = date.toLocaleDateString('pt-BR', { month: 'long' })

		// Se for até 7 dias úteis (aproximadamente 1 semana)
		if (value <= 7) {
			return `Receba até ${weekday}, ${day} de ${month}`
		} else {
			return `Receba até ${day} de ${month}`
		}
	}

	return date
}

export const getShippingEstimate = sla => {
	const shippingEstimate = sla.shippingEstimate

	const isHours = shippingEstimate.indexOf('h') > -1
	const isMinutes = shippingEstimate.indexOf('m') > -1
	const useBd = shippingEstimate.indexOf('bd') > -1

	const value = parseInt(shippingEstimate)

	let date = null

	if (isMinutes) {
		date = addMinutesToDate(value)
	} else if (isHours) {
		date = addHoursToDate(value)
	} else if (useBd) {
		date = addDaysToDate(value, true)
	} else {
		date = addDaysToDate(value, false)
	}

	return date
}
