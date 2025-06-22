import { useTranslation } from 'eitri-i18n'
import { View, Text, Button, Radio } from 'eitri-luminus'

export default function ShippingMethods(props) {
	const { customLogisticInfo, onSelectCustomLogistiInfoOption, ...rest } = props

	const { t } = useTranslation()

	const handleMethodChange = option => {
		onSelectCustomLogistiInfoOption(option)
	}

	if (!customLogisticInfo || customLogisticInfo?.options.length === 0) {
		return null
	}

	return (
		<View {...rest}>
			<Text className="font-bold text-xs mb-1">
				{t('shippingMethods.txtSelectDelivery')}
			</Text>
			<View className="w-full flex flex-col rounded border border-neutral-700 px-4">
				{customLogisticInfo &&
					customLogisticInfo?.options.map((option, index) => (
						<Button
							key={option.label}
							onClick={() => handleMethodChange(option)}
							className={`border-b border-neutral-700 ${index < customLogisticInfo?.options.length - 1 ? '' : 'border-b-0'}`}>
							<View className="py-2 px-1 flex justify-between items-center w-full">
								<View className="flex flex-row items-center gap-3">
									<Radio checked={option.isCurrent} />
									<View className="flex flex-col gap-1.5">
										<Text>{option.label}</Text>
										<Text className="text-xs text-neutral-700">
											{option?.shippingEstimate}
										</Text>
									</View>
								</View>
								<View className="w-1/5 border-l border-neutral-700 h-[35px] flex flex-row items-center pl-1">
									<Text>{option.price}</Text>
								</View>
							</View>
						</Button>
					))}
			</View>
		</View>
	)
}
