import { Text, View, Image } from 'eitri-luminus'
import { CustomCarousel } from 'shopping-vtex-template-shared'
import { getSpacingValue } from '../../../../utils/utils'

export default function SliderHero(props) {
	const { data, onClick } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const imagesList = data.images

	// Sem esse if, quando cliente cadastra algo errado sem imagem no cms fica quebrando
	if (!imagesList.length) return null

	const onChangeSlide = i => setCurrentSlide(i)

	let proportionalHeight = 'auto'

	if (data?.aspectRatio) {
		try {
			const [aspectWidth, aspectHeight] = data?.aspectRatio?.split(':')?.map(Number) || []
			const screenWidth = window.innerWidth

			proportionalHeight = screenWidth * (aspectHeight / aspectWidth)
		} catch (e) {
			console.error('Error calculating aspect ratio [SliderHero]:', e)
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

			<CustomCarousel
				onSlideChange={onChange}
				autoPlay={data.autoPlay ?? true}
				interval={6000}
				loop={true}>
				{imagesList?.map(image => (
					<View
						className='w-full flex justify-center snap-x snap-always'
						key={`image_${image.imageUrl}`}>
						<View
							onClick={() => onClick(image)}
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
							// Não alterei nenhum estilo, so organizei, antes estava fazendo 2 condições sendo que podia fazer de uma vez
							key={index}
							className={`${currentSlide === index ? 'bg-primary w-9' : 'bg-base-300 w-3'} h-1.5 rounded-lg transition-[width,background-color] duration-300 ease-in-out`}
						/>
					))}
				</View>
			)}
		</View>
	)
}
