import { View } from 'eitri-luminus'
import ProductCard from '../../ProductCard/ProductCard'

export default function ShelfOfProductsSlider(props) {
	const { isLoading, products } = props

	return (
		<>
			{isLoading ? (
				<View className='flex overflow-x-auto gap-4 px-4 py-2 mt-2'>
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
					<View className='min-w-[50vw] h-[370px] bg-gray-200 rounded animate-pulse' />
				</View>
			) : (
				<View className='flex overflow-x-auto'>
					<View className='flex gap-4 px-4 py-2'>
						{products.map((product, i) => (
							<ProductCard
								key={`${product.productId}-${i}`}
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
