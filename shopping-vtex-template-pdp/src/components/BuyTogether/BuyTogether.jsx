import { GenericBox } from 'shopping-vtex-template-shared'
import { showTogether } from '../../services/productService'
import { formatAmount } from '../../utils/utils'

export default function BuyTogether(props) {
	const { product, onSelectionChange } = props

	const [showTogetherProducts, setShowTogetherProducts] = useState([])
	const [selectedSkuSelections, setSelectedSkuSelections] = useState([])

	useEffect(() => {
		load()
	}, [])

	useEffect(() => {
		if (!onSelectionChange) return

		const selectedSkus = selectedSkuSelections
			.map(selection => {
				const showTogetherProduct = showTogetherProducts.find(product => {
					const item = product?.items?.[0]
					return item?.itemId === selection.skuId
				})
				const sku = showTogetherProduct?.items?.[0]
				if (!sku) return null

				return {
					...sku,
					selectedSellerId: selection.sellerId
				}
			})
			.filter(Boolean)

		onSelectionChange(selectedSkus)
	}, [selectedSkuSelections, showTogetherProducts, onSelectionChange])

	const load = async () => {
		const products = await showTogether(product.productId)
		// const initialSelections = products
		// 	.map(showTogetherProduct => {
		// 		const sku = showTogetherProduct?.items?.[0]
		// 		const mainSeller = getMainSeller(sku)
		// 		const skuId = sku?.itemId
		// 		const sellerId = mainSeller?.sellerId
		//
		// 		if (!skuId || !sellerId) return null
		//
		// 		return { skuId, sellerId }
		// 	})
		// 	.filter(Boolean)

		setShowTogetherProducts(products)
		// setSelectedSkuSelections(initialSelections)
	}

	const toggleSelectedSku = (skuId, sellerId) => {
		setSelectedSkuSelections(currentSelected => {
			const selectedIndex = currentSelected.findIndex(
				selected => selected.skuId === skuId && selected.sellerId === sellerId
			)

			if (selectedIndex > -1) {
				return currentSelected.filter((_, index) => index !== selectedIndex)
			}

			return [...currentSelected, { skuId, sellerId }]
		})
	}

	const getMainSeller = sku => {
		return sku?.sellers?.find(seller => seller?.sellerDefault) || sku?.sellers?.[0]
	}

	if (showTogetherProducts?.length === 0) return null

	return (
		<GenericBox className={'flex flex-col gap-4'}>
			<Text className='text-lg font-bold text-gray-800'>eeei, aproveite e leve também!</Text>
			{showTogetherProducts.map(showTogetherProduct => {
				const sku = showTogetherProduct?.items?.[0]
				const imageUrl = sku.images[0]?.imageUrl
				const skuId = sku?.itemId
				const mainSeller = getMainSeller(sku)
				const sellerId = mainSeller?.sellerId
				const isSelected = selectedSkuSelections.some(
					selected => selected.skuId === skuId && selected.sellerId === sellerId
				)
				const price = mainSeller?.commertialOffer?.Price

				if (!skuId || !sellerId) return null

				return (
					<View
						key={skuId}
						onClick={() => toggleSelectedSku(skuId, sellerId)}
						className={`relative rounded-lg p-3 flex flex-row gap-3 items-start ${
							isSelected ? 'border-2 border-red-500' : 'border-2 border-neutral-200'
						}`}>
						{isSelected && (
							<View
								className={`absolute -top-2 -right-2 w-5 h-5 rounded-full border flex items-center justify-center bg-red-500 border-red-500`}>
								{isSelected && <Text className='text-xs text-white font-bold'>✓</Text>}
							</View>
						)}

						<View className='flex items-start gap-4'>
							<Image
								src={imageUrl}
								width={80}
								className={'rounded-sm object-fit'}
							/>
							<View className={'flex flex-col gap-1'}>
								<Text className='text-sm font-semibold text-gray-800'>
									{sku?.nameComplete || showTogetherProduct?.productName}
								</Text>
								<Text className='text text-neutral-700 mt-1 font-bold'>{formatAmount(price)}</Text>
							</View>
						</View>
					</View>
				)
			})}
		</GenericBox>
	)
}
