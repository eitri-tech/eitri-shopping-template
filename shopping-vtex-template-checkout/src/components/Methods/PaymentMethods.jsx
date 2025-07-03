import ImplementationInterface from '../PaymentsGroups/ImplementationInterface'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { getPaymentSystem } from '../../utils/getPaymentSystem'

export default function PaymentMethods(props) {
	const { cart } = useLocalShoppingCart()

	const { onSelectPaymentMethod } = props

	const paymentSystemGroups = getPaymentSystem(cart)

	return (
		<View className='w-full gap-4 flex flex-col'>
			{paymentSystemGroups?.map(system => {
				return (
					<ImplementationInterface
						key={system.groupName}
						groupName={system.groupName}
						systemGroup={system}
						onSelectPaymentMethod={onSelectPaymentMethod}
					/>
				)
			})}
		</View>
	)
}
