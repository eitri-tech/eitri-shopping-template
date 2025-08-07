import { View, Carousel, Image } from 'eitri-luminus'
import { useState } from 'react'
import { CustomCarousel } from 'shopping-vtex-template-shared'

export default function ImageCarousel(props) {
	const [currentSlide, setCurrentSlide] = useState(0)
	const { currentSku } = props

	const onChange = index => {
		setCurrentSlide(index)
	}

	return (
		<View>
			<CustomCarousel
				onSlideChange={onChange}
				autoPlay={false}
				loop={true}>
				{currentSku?.images?.map((item, index) => {
					return (
						<View
							key={item.imageUrl}
							className={`flex justify-center items-center`}>
							<Image
								pinchZoom
								zoomMaxScale={8}
								fadeIn={500}
								src={item.imageUrl}
								width='100vw'
							/>
						</View>
					)
				})}
			</CustomCarousel>
			{currentSku?.images?.length > 1 && (
				<View className='flex justify-center gap-2 mt-2'>
					{currentSku?.images?.map((_, index) => (
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
