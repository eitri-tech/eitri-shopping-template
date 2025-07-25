import ProductCard from '../../ProductCard/ProductCard'
import ProductCardLoading from './ProductCardLoading'
import { View } from 'eitri-luminus'

export default function ShelfOfProductsSlider(props) {
	const { isLoading, products, gap } = props
	const products_per_page = 2

	const productsPage = []

	if (Array.isArray(products)) {
		for (let i = 0; i < products.length; i += products_per_page) {
			productsPage.push(products.slice(i, i + products_per_page))
		}
	}

	return (
		<>
			{isLoading ? (
				<View className='flex overflow-x-auto'>
					<View className='flex gap-4 px-4 py-2'>
						<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
						<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
						<View className='mt-2 min-w-[50vw] h-[388px] bg-gray-200 rounded animate-pulse' />
					</View>
				</View>
			) : (
				<View className='flex overflow-x-auto'>
					<View className='flex gap-4 px-4 py-2'>
						{products.map(product => (
							<ProductCard
								key={product.productId}
								product={product}
								className={`min-w-[50vw]`}
							/>
						))}
					</View>
				</View>
			)}
		</>
	)
}
