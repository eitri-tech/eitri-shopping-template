import { Loading } from 'shopping-vtex-template-shared'
import { View, Text, Image } from 'eitri-luminus'
import ProductCard from '../ProductCard/ProductCard'
import { useTranslation } from 'eitri-i18n'

export default function SearchResults(props) {
	const { searchResults, isLoading } = props

	if (searchResults.length === 0 && !isLoading) {
		return (
			<View className='flex flex-col items-center justify-center py-16 gap-4'>
				<View className='w-16 h-16 mb-2 opacity-60'>
					<svg
						width='100%'
						height='100%'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M15.7494 15L9.75 9M9.75064 15L15.75 9'
							stroke='#65666E'
							strokeWidth='1.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
						<path
							d='M22.75 12C22.75 6.47715 18.2728 2 12.75 2C7.22715 2 2.75 6.47715 2.75 12C2.75 17.5228 7.22715 22 12.75 22C18.2728 22 22.75 17.5228 22.75 12Z'
							stroke='#65666E'
							strokeWidth='1.5'
						/>
					</svg>
				</View>
				<Text className='text-lg font-semibold text-base-content/80 text-center'>
					Nenhum produto encontrado
				</Text>
				<Text className='text-base text-base-content/60 text-center max-w-xs'>
					Tente ajustar sua busca ou explorar outras categorias.
				</Text>
			</View>
		)
	}

	return (
		<View className='flex flex-col p-4 gap-4'>
			<View className='grid grid-cols-2 gap-2'>
				{searchResults.map((product, index) => (
					<View
						key={product.productId}
						className='w-full'>
						<ProductCard product={product} />
					</View>
				))}
			</View>

			{isLoading && (
				<View className='flex items-center justify-center'>
					<Loading />
				</View>
			)}
		</View>
	)
}
