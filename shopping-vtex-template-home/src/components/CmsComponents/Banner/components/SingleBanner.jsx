import { Text, View } from 'eitri-luminus'
import { getSpacingValue } from '../../../../utils/utils'

export default function SingleBanner(props) {
	const { data, onClick } = props

	const imagesList = data.images

	let proportionalHeight = 'auto'

	if (data?.aspectRatio) {
		try {
			const [aspectWidth, aspectHeight] = data?.aspectRatio?.split(':')?.map(Number) || []
			const screenWidth = window.innerWidth

			proportionalHeight = screenWidth * (aspectHeight / aspectWidth)
		} catch (e) {
			console.error('Error calculating aspect ratio [SingleBanner]:', e)
		}
	}

	// Expliquei o que essa lógica faz no componente 'FitOnScreen'
	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))

	const marginTop = getSpacingValue(paramsObject?.marginTop)
	const marginBottom = getSpacingValue(paramsObject?.marginBottom)

	return (
		<View
			className={`relative ${data?.isHideBanner ? 'hidden' : `flex flex-col`}`}
			style={{
				...(marginTop && { marginTop }),
				...(marginBottom && { marginBottom })
			}}>
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
					className='flex px-4 w-full'>
					<Image
						src={imagesList[0].imageUrl}
						className='w-full h-full rounded'
					/>
				</View>
			)}
		</View>
	)
}
