import { App } from 'eitri-shopping-vtex-shared'

export default function SkuSelector(props) {
	const { product, currentSku, onSkuChange, marginTop } = props
	const [skuVariations, setSkuVariations] = useState([])

	useEffect(() => {
		const selectedVariations = product?.items?.reduce((acc, item) => {
			item?.variations?.length > 0 &&
				item?.variations?.forEach(variation => {
					const accVar = acc.find(foundVariation => foundVariation?.field?.name === variation.name)
					if (accVar) {
						if (!accVar.values.some(value => value.name === variation.values?.[0])) {
							accVar.values.push({
								name: variation.values?.[0],
								originalName: variation.values?.[0]
							})
						}
					} else {
						acc.push({
							field: {
								name: variation.name,
								originalName: variation.name
							},
							values: [
								{
									name: variation.values?.[0],
									originalName: variation.values?.[0]
								}
							]
						})
					}
				})
			return acc
		}, [])
		setSkuVariations(selectedVariations)
	}, [])

	const handleSkuChange = (variationToChange, valueToChange) => {
		const variationOfCurrentSku = currentSku.variations.map(variation => ({
			variation: variation.name,
			value: currentSku[variation.name][0]
		}))
		const newDesiredVariation = variationOfCurrentSku.map(variation => {
			if (variation.variation === variationToChange) {
				return {
					variation: variationToChange,
					value: valueToChange
				}
			}
			return variation
		})
		onSkuChange(newDesiredVariation)
	}

	if (!(skuVariations?.length > 0)) {
		return null
	}

	const renderOption = (sku, value) => {
		if (
			App.configs?.appConfigs?.pdp?.preferImageOnSkuSelectFor?.toLocaleLowerCase() ===
			sku?.field?.name?.toLocaleLowerCase()
		) {
			const findSku = product.items.find(item => item[sku?.field?.name][0] === value?.name)
			return (
				<View
					onClick={() => handleSkuChange(sku?.field?.name, value?.name)}
					className='flex items-center'>
					<View
						className={`border ${currentSku?.[sku?.field?.name]?.[0] === value?.name ? 'border-primary-content' : 'border-none'}`}>
						<Image
							src={findSku?.images?.[0]?.imageUrl}
							className='max-w-40 max-h-40'
						/>
					</View>
					<Text>{value?.name}</Text>
				</View>
			)
		}
		return (
			<View
				onClick={() => handleSkuChange(sku?.field?.name, value?.name)}
				className='flex items-center gap-2'>
				<Radio
					name={sku?.field?.name}
					checked={currentSku?.[sku?.field?.name][0] === value?.name}
					onChange={_ => {}}
				/>
				<Text>{value?.name}</Text>
			</View>
		)
	}

	return (
		<View className={`flex flex-col gap-2`}>
			{skuVariations?.map((sku, index) => (
				<View>
					<Text className='font-bold text-base'>{`${sku?.field?.name}`}</Text>
					<View className='flex flex-wrap mt-1 gap-2'>
						{sku?.values?.map(value => renderOption(sku, value))}
					</View>
				</View>
			))}
		</View>
	)
}
