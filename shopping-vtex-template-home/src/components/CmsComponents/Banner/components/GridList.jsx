import { Text, View } from 'eitri-luminus'
export default function GridList(props) {
	const { data, onPress } = props
	const imagesList = data?.images

	return (
		<View>
			{data?.mainTitle && (
				<View className='px-4 mb-2'>
					<Text className='font-bold'>{data.mainTitle}</Text>
				</View>
			)}
			<View className='grid grid-cols-2 gap-3 px-4'>
				{imagesList?.map(image => (
					<View
						key={image.imageUrl}
						onClick={() => onPress(image)}
						className='flex flex-col justify-center items-center gap-2'>
						<Image
							src={image.imageUrl}
							className='w-full h-auto'
						/>
						{image?.action?.title && <Text className='font-bold'>{image?.action?.title}</Text>}
					</View>
				))}
			</View>
		</View>
	)
}
