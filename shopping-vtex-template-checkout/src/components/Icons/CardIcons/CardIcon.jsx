import Visa from './Networks/Visa'
import Mastercard from './Networks/Mastercard'
import AmericanExpress from './Networks/AmericanExpress'
import Hipercard from './Networks/Hipercard'
import Elo from './Networks/Elo'
import Diners from './Networks/Diners'

export default function CardIcon(props) {
	const iconKey = props.iconKey

	if (iconKey === 'Visa') {
		return <Visa />
	}
	if (iconKey === 'Mastercard') {
		return <Mastercard />
	}
	if (iconKey === 'American Express') {
		return <AmericanExpress />
	}
	if (iconKey === 'Hipercard') {
		return <Hipercard />
	}
	if (iconKey === 'Elo') {
		return <Elo />
	}

	if (iconKey === 'Diners') {
		return <Diners />
	}

	return ''
}
