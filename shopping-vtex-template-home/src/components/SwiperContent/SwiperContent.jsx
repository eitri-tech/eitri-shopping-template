import { Text, View } from 'eitri-luminus'
export default function SwiperContent(props) {
	const { title, children, marginBottom, paddingHorizontal, gap } = props
	return (
		<View className='flex flex-col gap-2'>
			{title && (
				<View className='px-4'>
					<Text className='font-bold text-xl'>{title}</Text>
				</View>
			)}
			<View className='flex flex-row overflow-x-scroll '>
				<View className={`gap-4 min-h-[72px] flex flex-row px-4`}>{children}</View>
				{paddingHorizontal && <View className={`mr-${paddingHorizontal} h-px`}>&nbsp;</View>}
			</View>
		</View>
	)
}
