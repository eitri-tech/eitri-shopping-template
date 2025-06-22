import { Text, View, Carousel, Image } from 'eitri-luminus'

export default function SliderHero(props) {
	const { data, onClick } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const imagesList = data.images

	const onSwipe = i => {
		setCurrentSlide(i)
	}

	return (
		<View className='relative'>
			{data.mainTitle && (
				<View className='px-4 flex items-center justify-center w-full'>
					<Text className='font-bold mb-8'>{data.mainTitle}</Text>
				</View>
			)}
			<Swiper
				config={{
					onChange: onSwipe,
					autoPlay: true
				}}>
				{imagesList &&
					imagesList.map(image => (
						<Swiper.Item
							className='w-full flex justify-center'
							key={`image_${image.imageUrl}`}>
							<View
								onClick={() => {
									onClick(image)
								}}>
								<Image
									className='w-full'
									src={image.imageUrl}
								/>
							</View>
						</Swiper.Item>
					))}
			</Swiper>
			{imagesList.length > 1 && (
				<View className='flex justify-center gap-2'>
					{imagesList &&
						Array.from(
							{
								length: imagesList.length
							},
							(_, index) => (
								<View
									key={index}
									className={`${currentSlide === index ? 'w-[36px]' : 'w-[12px]'} h-[6px] rounded-lg ${currentSlide === index ? 'bg-primary' : 'bg-base-300'} transition-[width,background-color] duration-300 ease-in-out"`}
								/>
							)
						)}
				</View>
			)}
		</View>
	)
}
