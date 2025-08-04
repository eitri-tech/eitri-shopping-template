import { View, Carousel, Image } from 'eitri-luminus'
import { useState } from 'react'

export default function ImageCarousel(props) {
	const [currentSlide, setCurrentSlide] = useState(0)
	const { currentSku } = props

	const onChange = index => {
		setCurrentSlide(index)
	}

	return (
		<View>
			<Carousel
				config={{
					onChange: onChange,
					currentSlide: currentSlide
				}}>
				{currentSku?.images?.map((item, index) => {
					return (
						<Carousel.Item key={index}>
							<View className={`flex justify-center items-center`}>
								<Image
									pinchZoom
									zoomMaxScale={8}
									fadeIn={500}
									src={item.imageUrl}
									width='100vw'
								/>
							</View>
						</Carousel.Item>
					)
				})}
			</Carousel>
			{currentSku?.images?.length > 1 && (
				<View className='flex justify-center mt-2 w-full'>
					<View className='flex justify-center flex flex-wrap gap-2 max-w-[90%]'>
						{currentSku.images.map((_, index) => (
							<View
								key={index}
								className={`${currentSlide === index ? 'w-[36px]' : 'w-[12px]'} h-[6px] rounded-lg ${
									currentSlide === index ? 'bg-primary' : 'bg-base-300'
								} transition-[width,background-color] duration-300 ease-in-out`}
							/>
						))}
					</View>
				</View>
			)}
		</View>
	)
}
