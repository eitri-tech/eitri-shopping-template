import { View, Text, Button, Radio } from 'eitri-luminus'

export default function GroupsWrapper(props) {
	const { title, icon, isChecked, children, onPress } = props

	// Destaque simples: borda primária e efeito scale
	const highlightClass = isChecked
		? 'border-2 border-primary scale-[102%]  transition-transform duration-300'
		: 'border border-neutral-400'

	return (
		<View
			onClick={onPress}
			className={`p-4 rounded flex flex-col cursor-pointer transition-all duration-300 ${highlightClass}`}>
			<View className='w-full flex flex-col'>
				<View className='flex flex-row items-center justify-between gap-3'>
					<View className='flex flex-row items-center gap-3'>
						<Text className='text-xs'>{title}</Text>
					</View>

					<View>{icon}</View>
				</View>
			</View>
			{children && isChecked && <View className='mt-4'>{children}</View>}
		</View>
	)
}
