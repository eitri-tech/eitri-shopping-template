import Card from '../../Icons/MethodIcons/Card'
import { useLocalShoppingCart } from '../../../providers/LocalCart'
import Boleto from '../../Icons/MethodIcons/Boleto'
import Pix from '../../Icons/MethodIcons/Pix'
import GroupsWrapper from './GroupsWrapper'

export default function InstantPayment(props) {
	const { cart } = useLocalShoppingCart()
	const { systemGroup, onSelectPaymentMethod } = props

	const VTEX_INSTANT_PAYMENT = '125'

	const onSelectThisGroup = () => {
		onSelectPaymentMethod([
			{
				paymentSystem: VTEX_INSTANT_PAYMENT,
				installmentsInterestRate: 0,
				installments: 1,
				referenceValue: cart.value,
				value: cart.value,
				hasDefaultBillingAddress: true
			}
		])
	}

	return (
		<GroupsWrapper
			title='Pix'
			icon={<Pix />}
			onPress={onSelectThisGroup}
			isChecked={systemGroup.isCurrentPaymentSystemGroup}
		/>
	)
}
