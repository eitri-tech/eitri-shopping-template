import { Loading } from 'shopping-vtex-template-shared'
import { View, Text } from 'eitri-luminus'
import ProductCard from '../ProductCard/ProductCard'
import { useTranslation } from 'eitri-i18n'

export default function SearchResults(props) {
	const { searchResults, isLoading } = props
	const { t } = useTranslation()

	if (searchResults.length === 0 && !isLoading) {
		return <Text>{t('searchResults.resultNotFound')}</Text>
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
