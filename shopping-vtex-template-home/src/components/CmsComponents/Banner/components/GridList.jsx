import { Text, View } from 'eitri-luminus'
export default function GridList(props) {
	const { data, onPress } = props
	const imagesList = data?.images

	return (
		<View>
			{data?.mainTitle && (
				<View className='px-4'>
					<Text className='font-bold'>{data.mainTitle}</Text>
				</View>
			)}
			<View className='grid grid-cols-2 gap-2 px-4'>
				{imagesList?.map(image => (
					<View
						key={image.imageUrl}
						onClick={() => onPress(image)}
						className='' // Adjust for two items per row with spacing
					>
						<Image
							src={image.imageUrl}
							className='w-full h-auto'
						/>
					</View>
				))}
			</View>
		</View>
	)
}
