import { Text, View } from 'eitri-luminus'
export default function BannerList(props) {
	const { data, onClick } = props
	const imagesList = data.images

	const width = data?.size?.maxWidth ? `${data?.size?.maxWidth}px` : '200px'
	const height = data?.size?.maxHeight ? `${data?.size?.maxHeight}px` : '200px'

	return (
		<View className='flex flex-col gap-2'>
			{data?.mainTitle && (
				<View className='px-4'>
					<Text className='font-bold text-xl'>{data.mainTitle}</Text>
				</View>
			)}
			<View className='flex overflow-x-auto'>
				<View className='flex gap-4 px-4'>
					{imagesList &&
						imagesList.map(slider => (
							<View
								style={{
									backgroundImage: `url(${slider.imageUrl})`,
									width: width,
									height: height,
									backgroundSize: 'cover'
								}}
								className={'rounded'}
								onClick={() => onClick(slider)}
							/>
						))}
				</View>
			</View>
		</View>
	)
}
