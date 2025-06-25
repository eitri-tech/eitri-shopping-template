import { Text, View } from 'eitri-luminus'
import SwiperContent from '../../../SwiperContent/SwiperContent'
export default function RoundedBannerList(props) {
	const { data, onPress } = props
	const imagesList = data.images
	return (
		<View>
			{data?.mainTitle && (
				<View className='px-4 mb-3'>
					<Text className='font-bold'>{data.mainTitle}</Text>
				</View>
			)}
			<SwiperContent className='px-4'>
				{imagesList &&
					imagesList.map(slider => (
						<View
							key={slider.imageUrl}
							className='flex flex-col mr-2 items-center'>
							<View
								key={slider.imageUrl}
								onClick={() => onPress(slider)}
								className='flex items-center justify-center h-full'>
								<Image
									src={slider.imageUrl}
									className={`${data?.size?.maxHeight ? `max-h-[70px]` : ''} ${data?.size?.maxWidth ? `max-w-[70px]` : ''}`}
								/>
							</View>
							{slider?.subLabel && (
								<Text className='font-bold text-center whitespace-nowrap'>{slider?.subLabel}</Text>
							)}
						</View>
					))}
			</SwiperContent>
		</View>
	)
}
