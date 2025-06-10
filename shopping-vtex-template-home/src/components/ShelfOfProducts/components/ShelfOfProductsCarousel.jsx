import ProductCard from '../../ProductCard/ProductCard'
import ProductCardLoading from './ProductCardLoading'
import { View, Carousel } from 'eitri-luminus'

export default function ShelfOfProductsCarousel(props) {
	const { isLoading, products, gap, locale, currency } = props
	const [currentSlide, setCurrentSlide] = useState(0)
	const products_per_page = 2

	const productsPage = []
	if (Array.isArray(products)) {
		for (let i = 0; i < products.length; i += products_per_page) {
			productsPage.push(products.slice(i, i + products_per_page))
		}
	}

	const handleScroll = e => {
		setCurrentSlide(e)
	}

	return (
		<>
			{isLoading ? (
				<ProductCardLoading gap={gap} />
			) : (
				<Swiper
					config={{
						onChange: handleScroll
					}}>
					{productsPage.map((page, index) => (
						<Swiper.Item key={page?.[0]?.productId || index}>
							<View className='flex w-full bg-primary h-[400px]'>
								{/*<ProductCard*/}
								{/*	product={page[0]}*/}
								{/*	className='max-w-[50%]'*/}
								{/*/>*/}
								{/*{page.length > 1 && (*/}
								{/*	<ProductCard*/}
								{/*		product={page[1]}*/}
								{/*		className='max-w-[50%]'*/}
								{/*	/>*/}
								{/*)}*/}
							</View>
						</Swiper.Item>
					))}
				</Swiper>
			)}
			<View className='mt-8 flex justify-center gap-2'>
				{productsPage.map((_, index) => (
					<View
						key={index}
						className={`w-8 h-[6px] ${currentSlide === index ? 'bg-green-700' : 'bg-neutral-300'}`}
					/>
				))}
			</View>
		</>
	)
}
