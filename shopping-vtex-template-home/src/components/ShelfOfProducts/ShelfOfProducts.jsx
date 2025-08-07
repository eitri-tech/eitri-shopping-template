import { Text, View } from 'eitri-luminus'
import ShelfOfProductsCarousel from './components/ShelfOfProductsCarousel'
import ShelfOfProductsSlider from './components/ShelfOfProductsSlider'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'

export default function ShelfOfProducts(props) {
	const { products, title, isLoading, mode, searchParams, ...rest } = props

	const { t } = useTranslation()

	const seeMore = () => {
		Eitri.navigation.navigate({
			path: 'ProductCatalog',
			state: {
				params: searchParams,
				title: title
			}
		})
	}

	return (
		<View>
			{title && (
				<View className={`flex justify-between items-center px-4`}>
					<Text className='font-bold text-xl'>{isLoading ? t('shelfOfProducts.loading') : title}</Text>
					{searchParams && (
						<View
							onClick={seeMore}
							className='flex items-center min-w-fit'>
							<Text className='font-bold'>{t('shelfOfProducts.seeMore')}</Text>
						</View>
					)}
				</View>
			)}

			{mode === 'carousel' && (
				<ShelfOfProductsCarousel
					isLoading={isLoading}
					products={products}
				/>
			)}

			{mode !== 'carousel' && (
				<ShelfOfProductsSlider
					isLoading={isLoading}
					products={products}
				/>
			)}
		</View>
	)
}
