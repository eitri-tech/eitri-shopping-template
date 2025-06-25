export default function formatDate(isoDate) {
	if (!isoDate) return ''

	const date = new Date(isoDate)

	const day = String(date.getUTCDate()).padStart(2, '0')
	const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Janeiro é 0!
	const year = date.getUTCFullYear()

	return `${day}/${month}/${year}`
}

export const formatDateDaysMonthYear = date => {
	const data = new Date(date)
	const dia = data.getDate()
	const mes = data.toLocaleString('pt-BR', { month: 'long' })
	const ano = data.getFullYear()
	return `${dia} de ${mes} de ${ano}`
}
