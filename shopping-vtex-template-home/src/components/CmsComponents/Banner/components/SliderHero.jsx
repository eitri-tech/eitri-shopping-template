import { Text, View, Carousel, Image } from 'eitri-luminus'

export default function SliderHero(props) {
	const { data, onClick } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const imagesList = data.images

	const onChange = i => {
		setCurrentSlide(i)
	}

	return (
		<View className='relative'>
			{data.mainTitle && (
				<View className='px-4 flex items-center justify-center w-full'>
					<Text className='font-bold mb-8'>{data.mainTitle}</Text>
				</View>
			)}
			<Carousel
				config={{
					onChange: onChange,
					autoPlay: true,
					interval: 4000,
					loop: true,
					currentSlide: currentSlide
				}}>
				{imagesList &&
					imagesList.map(image => (
						<Carousel.Item
							className='w-full flex justify-center snap-x snap-always'
							key={`image_${image.imageUrl}`}>
							<View
								onClick={() => {
									onClick(image)
								}}>
								<Image
									fadeIn={1000}
									className='w-full'
									src={image.imageUrl}
								/>
							</View>
						</Carousel.Item>
					))}
			</Carousel>
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
