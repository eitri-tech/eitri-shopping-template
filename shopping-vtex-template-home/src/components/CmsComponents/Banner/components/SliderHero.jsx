import { Text, View, Image } from 'eitri-luminus'
import { CustomCarousel } from 'shopping-vtex-template-shared'

export default function SliderHero(props) {
	const { data, onClick } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const imagesList = data.images

	const onChange = i => {
		setCurrentSlide(i)
	}

	let proportionalHeight = 'auto'

	if (data?.aspectRatio) {
		try {
			const [aspectWidth, aspectHeight] = data?.aspectRatio?.split(':')?.map(Number)
			const screenWidth = window.innerWidth
			proportionalHeight = screenWidth * (aspectHeight / aspectWidth)
		} catch (e) {}
	}

	return (
		<View className='relative'>
			{data.mainTitle && (
				<View className='px-4 flex items-center justify-center w-full'>
					<Text className='font-bold mb-8'>{data.mainTitle}</Text>
				</View>
			)}
			<CustomCarousel
				onSlideChange={onChange}
				autoPlay={data.autoPlay ?? true}
				interval={6000}
				loop={true}>
				{imagesList &&
					imagesList.map(image => (
						<View
							className='w-full flex justify-center snap-x snap-always'
							key={`image_${image.imageUrl}`}>
							<View
								onClick={() => {
									onClick(image)
								}}
								height={proportionalHeight}
								width='100%'>
								<Image
									fadeIn={1000}
									className='w-full h-full'
									src={image.imageUrl}
								/>
							</View>
						</View>
					))}
			</CustomCarousel>
			{imagesList.length > 1 && (
				<View className='flex justify-center gap-2 mt-2'>
					{imagesList.map((_, index) => (
						<View
							key={index}
							className={`${currentSlide === index ? 'w-[36px]' : 'w-[12px]'} h-[6px] rounded-lg ${
								currentSlide === index ? 'bg-primary' : 'bg-base-300'
							} transition-[width,background-color] duration-300 ease-in-out"`}
						/>
					))}
				</View>
			)}
		</View>
	)
}
