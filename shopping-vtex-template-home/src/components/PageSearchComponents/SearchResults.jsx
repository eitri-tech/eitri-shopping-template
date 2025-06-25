import { Loading } from 'shopping-vtex-template-shared'
import { View } from 'eitri-luminus'
import ProductCard from '../ProductCard/ProductCard'
import { useTranslation } from 'eitri-i18n'
export default function SearchResults(props) {
	const { searchResults, isLoading } = props
	const { t } = useTranslation()
	if (searchResults.length === 0 && !isLoading) {
		return <Text>{t('searchResults.resultNotFound')}</Text>
	}
	return (
		<View className='flex flex-col'>
			{searchResults.map(
				(product, index) =>
					index % 2 === 0 && (
						<View
							key={searchResults[index].productId}
							className='flex'>
							<View className='pr-1 w-[50%]'>
								<ProductCard product={searchResults[index]} />
							</View>
							{searchResults[index + 1] && (
								<View className='pl-1 w-[50%]'>
									<ProductCard product={searchResults[index + 1]} />
								</View>
							)}
						</View>
					)
			)}
			{isLoading && (
				<View className='flex items-center justify-center'>
					<Loading />
				</View>
			)}
		</View>
	)
}
