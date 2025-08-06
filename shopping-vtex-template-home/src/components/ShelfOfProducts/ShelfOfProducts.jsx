import { Loading } from 'shopping-vtex-template-shared'
import { Text, View, Skeleton } from 'eitri-luminus'
import ProductCard from '../ProductCard/ProductCard'
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

			{mode === 'scroll' && (
				<ShelfOfProductsSlider
					isLoading={isLoading}
					products={products}
				/>
			)}

			{mode === 'carousel' && (
				<ShelfOfProductsSlider
					isLoading={isLoading}
					products={products}
				/>
			)}

			{/*{mode === 'carousel' && (*/}
			{/*	<ShelfOfProductsCarousel*/}
			{/*		isLoading={isLoading}*/}
			{/*		products={products}*/}
			{/*		gap={gap}*/}
			{/*	/>*/}
			{/*)}*/}

			{/*{mode !== 'carousel' && (*/}
			{/*	<View className={`flex flex-row overflow-x-scroll scroll-snap-x-mandatory gap-${gap}`}>*/}
			{/*		{gap && <View className={`h-[1px] w-[${gap}px]`} />}*/}
			{/*		{isLoading && <View className={`mt-2 w-full h-[388px] bg-gray-200 rounded animate-pulse`} />}*/}
			{/*		{!isLoading &&*/}
			{/*			products &&*/}
			{/*			products.map(product => (*/}
			{/*				<View className={`scroll-snap-start  ml-[${gap}px]`}>*/}
			{/*					<ProductCard*/}
			{/*						product={product}*/}
			{/*						key={product?.productId}*/}
			{/*						width='188px'*/}
			{/*					/>*/}
			{/*				</View>*/}
			{/*			))}*/}
			{/*	</View>*/}
			{/*)}*/}
		</View>
	)
}
