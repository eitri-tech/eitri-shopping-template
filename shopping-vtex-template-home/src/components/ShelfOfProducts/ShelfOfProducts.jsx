import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { Text, View } from 'eitri-luminus'
import { getSpacingValue } from '../../utils/utils'
import ShelfOfProductsCarousel from './components/ShelfOfProductsCarousel'
import ShelfOfProductsSlider from './components/ShelfOfProductsSlider'

export default function ShelfOfProducts(props) {
	const { products, title, isLoading, mode, searchParams, params, ...rest } = props

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

	// Expliquei o que essa lógica faz no componente 'FitOnScreen'
	const marginTop = getSpacingValue(params?.marginTop)
	const marginBottom = getSpacingValue(params?.marginBottom)

	return (
		<View
			style={{
				...(marginTop && { marginTop }),
				...(marginBottom && { marginBottom })
			}}>
			{title && (
				<View className={`flex justify-between items-center px-4`}>
					<Text className='font-bold text-xl'>
						{isLoading ? t('shelfOfProducts.loading', 'Carregando...') : title}
					</Text>

					{searchParams && (
						<View
							onClick={seeMore}
							className='flex items-center min-w-fit'>
							<Text className='font-bold text-sm underline'>
								{t('shelfOfProducts.seeMore', 'Ver mais')}
							</Text>
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
