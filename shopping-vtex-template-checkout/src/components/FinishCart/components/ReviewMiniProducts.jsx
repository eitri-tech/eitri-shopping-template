export default function ReviewMiniProducts(props) {
	const { products } = props

	return (
		<View className='flex flex-col gap-2'>
			{products?.map(item => (
				<View
					key={item.imageUrl}
					className='flex flex-row w-full gap-3'>
					<View className='flex justify-center min-w-[40px] max-w-[40px] bg-neutral-200'>
						<Image
							src={item?.imageUrl?.replace('http:', 'https:')}
							className='object-cover'
						/>
					</View>
					<Text className='text-sm'>{item.name}</Text>
				</View>
			))}
		</View>
	)
}
