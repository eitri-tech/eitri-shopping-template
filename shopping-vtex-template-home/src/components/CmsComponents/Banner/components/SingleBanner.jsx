import { Text, View } from 'eitri-luminus'
export default function SingleBanner(props) {
	const { data, onClick } = props

	const imagesList = data.images

	let proportionalHeight = 'auto'

	if (data?.aspectRatio) {
		try {
			const [aspectWidth, aspectHeight] = data?.aspectRatio?.split(':')?.map(Number)
			const screenWidth = window.innerWidth
			proportionalHeight = screenWidth * (aspectHeight / aspectWidth)
		} catch (e) {}
	}

	return (
		<View className='relative '>
			{data.mainTitle && (
				<View className='px-4 flex items-center justify-center w-full'>
					<Text className='font-bold mb-8'>{data.mainTitle}</Text>
				</View>
			)}

			{imagesList && imagesList[0] && (
				<View
					key={imagesList[0].imageUrl}
					onClick={() => onClick(imagesList[0])}
					height={proportionalHeight}
					className='px-4 flex flex-row w-full'>
					<Image
						src={imagesList[0].imageUrl}
						className='w-full h-full rounded'
					/>
				</View>
			)}
		</View>
	)
}
