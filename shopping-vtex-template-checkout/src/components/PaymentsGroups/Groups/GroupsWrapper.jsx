import { Text, View } from 'eitri-luminus'

export default function GroupsWrapper(props) {
	const { title, subtitle, icon, children, onPress, className } = props

	return (
		<View className={`bg-white rounded shadow-sm border border-gray-300 p-4 ${className || ''}`}>
			<View
				onClick={onPress}
				className='w-full flex flex-col'>
				<View className='flex flex-row items-top gap-3'>
					<View className='py-1'>{icon}</View>
					<View className='flex flex-col'>
						<Text className='text font-bold'>{title}</Text>
						{subtitle && <Text className='text-sm'>{subtitle}</Text>}
					</View>
				</View>
			</View>
			{children && <View className='mt-4'>{children}</View>}
		</View>
	)
}
