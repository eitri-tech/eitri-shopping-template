import ImplementationInterface from '../PaymentsGroups/ImplementationInterface'

export default function PaymentMethods(props) {
	const { paymentSystems } = props
	return (
		<View className="w-full gap-4 flex flex-col">
			{paymentSystems?.map(system => {
				return (
					<ImplementationInterface
						key={system.groupName}
						groupName={system.groupName}
						paymentSystems={system.paymentSystems}
					/>
				)
			})}
		</View>
	)
}
