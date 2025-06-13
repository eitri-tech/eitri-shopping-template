import SwiperContent from '../../../SwiperContent/SwiperContent'
import { Text, View, Image } from 'eitri-luminus'
export default function BannerList(props) {
	const { data, onClick } = props
	const imagesList = data.images

	const isANumber = value => (typeof value === 'number' || /^\d+$/.test(value) ? true : false)

	const width = data?.size?.maxWidth
	const height = data?.size?.maxHeight

	return (
		<View className='flex flex-col gap-2'>
			{data?.mainTitle && (
				<View className='px-4'>
					<Text className='font-bold text-xl'>{data.mainTitle}</Text>
				</View>
			)}
			<View className='flex w-full overflow-x-auto gap-2'>
				{imagesList &&
					imagesList.map(slider => (
						<View
							style={{
								'--w': `${width || 200}px`,
								'--h': `${height || 100}px`
							}}
							className='w-[var(--w)] h-[var(--h)]'
							onClick={() => onClick(slider)}>
							<Image
								src={slider.imageUrl}
								maxHeight={height}
								maxWidth={width}
								className={`bg-neutral rounded-lg flex-grow`}
							/>
						</View>
					))}
			</View>
		</View>
	)
}
