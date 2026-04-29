import { Text, View } from 'eitri-luminus'
import { getSpacingValue } from '../../../../utils/utils'

export default function GridList(props) {
	const { data, onClick } = props
	const imagesList = data?.images

	// Expliquei o que essa lógica faz no componente 'FitOnScreen'
	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))

	const marginTop = getSpacingValue(paramsObject?.marginTop)
	const marginBottom = getSpacingValue(paramsObject?.marginBottom)

	return (
		<View
			className={`${data?.isHideBanner ? 'hidden' : `flex flex-col`}`}
			style={{
				...(marginTop && { marginTop }),
				...(marginBottom && { marginBottom })
			}}>
			{data?.mainTitle && (
				<View className='px-4'>
					<Text className='font-bold'>{data.mainTitle}</Text>
				</View>
			)}

			<View className='grid grid-cols-2 gap-2 px-4'>
				{imagesList?.map(image => (
					<View
						key={image.imageUrl}
						onClick={() => onClick(image)}
						className='' // Adjust for two items per row with spacing
					>
						<Image
							src={image.imageUrl}
							className='w-auto h-full'
						/>
					</View>
				))}
			</View>
		</View>
	)
}
