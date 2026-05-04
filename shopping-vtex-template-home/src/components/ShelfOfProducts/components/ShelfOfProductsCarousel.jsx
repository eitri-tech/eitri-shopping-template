import { View } from 'eitri-luminus'
import { CustomCarousel } from 'shopping-vtex-template-shared'
import ProductCard from '../../ProductCard/ProductCard'

export default function ShelfOfProductsCarousel(props) {
	const { isLoading, products } = props

	const [currentSlide, setCurrentSlide] = useState(0)
	const products_per_page = 2

	const productsPage = []

	if (Array.isArray(products)) {
		for (let i = 0; i < products.length; i += products_per_page) {
			productsPage.push(products.slice(i, i + products_per_page))
		}
	}

	const handleScroll = e => setCurrentSlide(e)

	return (
		<>
			{isLoading ? (
				<View className='flex overflow-x-auto gap-4 px-4 py-2 mt-2'>
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
				</View>
			) : (
				<>
					<CustomCarousel
						autoPlay={false}
						loop={true}
						onSlideChange={handleScroll}>
						{productsPage.map((page, index) => (
							<View
								key={page?.[0]?.productId ? `${page?.[0]?.productId}-${index}` : index}
								className='grid grid-cols-2 gap-2 px-4 py-2'>
								<ProductCard product={page[0]} />

								{page.length > 1 && <ProductCard product={page[1]} />}
							</View>
						))}
					</CustomCarousel>

					{productsPage.length > 1 && (
						<View className='flex justify-center gap-2 mt-2'>
							{productsPage.map((_, index) => (
								<View
									key={index}
									className={`${currentSlide === index ? 'bg-primary w-9' : 'bg-base-300 w-3'} h-1.5 rounded-lg transition-[width,background-color] duration-300 ease-in-out`}
								/>
							))}
						</View>
					)}
				</>
			)}
		</>
	)
}
