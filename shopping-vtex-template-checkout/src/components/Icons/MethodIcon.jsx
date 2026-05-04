import Boleto from './MethodIcons/Boleto'
import Card from './MethodIcons/Card'
import Pix from './MethodIcons/Pix'

export default function MethodIcon(props) {
	const method = props.iconKey

	if (method === 'Boleto Bancário') {
		return <Boleto />
	}

	if (method === 'Pix') {
		return <Pix />
	}

	if (method === 'Cartão de Crédito') {
		return <Card />
	}

	return ''
}
