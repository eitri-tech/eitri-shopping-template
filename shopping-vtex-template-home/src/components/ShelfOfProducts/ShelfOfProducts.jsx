import { Loading } from 'shopping-vtex-template-shared'
import { Text, View, Skeleton } from 'eitri-luminus'
import ProductCard from '../ProductCard/ProductCard'
import ShelfOfProductsCarousel from './components/ShelfOfProductsCarousel'
import ShelfOfProductsSlider from './components/ShelfOfProductsSlider'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
export default function ShelfOfProducts(props) {
	const { products, title, gap, paddingHorizontal, isLoading, mode, searchParams, ...rest } = props

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
				<ShelfOfProductsSlider
					isLoading={isLoading}
					products={products}
					gap={gap}
				/>
			)}

			{/*{mode === 'carousel' && (*/}
			{/*	<ShelfOfProductsCarousel*/}
			{/*		isLoading={isLoading}*/}
			{/*		products={products}*/}
			{/*		gap={gap}*/}
			{/*	/>*/}
			{/*)}*/}

			{mode !== 'carousel' && (
				<View className={`flex flex-row overflow-x-scroll scroll-snap-x-mandatory gap-${gap}`}>
					{gap && <View className={`h-[1px] w-[${gap}px]`} />}
					{isLoading && (
						<View className={`flex flex-row gap-2 px-4 justify-center`}>
							<Skeleton className='w-[188px] min-h-[288px] bg-neutral'></Skeleton>
							<Skeleton className='w-[188px] min-h-[288px] bg-neutral'></Skeleton>
						</View>
					)}
					{!isLoading &&
						products &&
						products.map(product => (
							<View className={`scroll-snap-start ml-[${gap}px]`}>
								<ProductCard
									product={product}
									key={product?.productId}
									width='188px'
								/>
							</View>
						))}
					{gap && <View className={`h-[1px] w-[${gap}px]`} />}
				</View>
			)}
		</View>
	)
}
