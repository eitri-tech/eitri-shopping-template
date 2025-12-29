export default function ReviewMiniProducts(props) {

	const { products } = props

	return (
		<View className='flex flex-col gap-2'>
			{products?.map(item => (
				<View
					key={item.imageUrl}
					className='flex flex-row justify-between w-full gap-2'>
					<View className='flex justify-center min-w-[40px] min-h-[40px] bg-neutral-200'>
						<Image
							src={item.imageUrl}
							className='object-cover'
						/>
					</View>
					<Text className='text-sm'>{item.name}</Text>
				</View>
			))}
		</View>
	)
}
