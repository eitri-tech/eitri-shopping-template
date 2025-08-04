import { App } from 'eitri-shopping-vtex-shared'

export default function SkuSelector(props) {
	const { product, currentSku, onSkuChange } = props
	const [skuVariations, setSkuVariations] = useState([])

	useEffect(() => {
		const selectedVariations = product?.items?.reduce((acc, item) => {
			if (!item?.variations?.length) return acc

			item.variations.forEach(variation => {
				// Normaliza a variação para formato objeto padrão
				const normalizedVariation =
					typeof variation === 'string' ? { name: variation, values: item[variation] } : variation

				const { name, values } = normalizedVariation
				if (!name || !values?.[0]) return // Guard clause para dados inválidos

				// Busca variação existente no acumulador
				let existingVariation = acc.find(v => v.name === name)

				if (!existingVariation) {
					// Cria nova variação se não existir
					existingVariation = {
						name,
						values: []
					}
					acc.push(existingVariation)
				}

				// Adiciona valor se não existir
				const valueExists = existingVariation.values.some(v => v.name === values[0])
				if (!valueExists) {
					existingVariation.values.push({
						name: values[0]
					})
				}
			})

			return acc
		}, [])
		setSkuVariations(selectedVariations)
	}, [])

	const handleSkuChange = (skuName, valueName) => {
		const variationOfCurrentSku = currentSku.variations.map(variation => {
			// Normaliza a variação para formato padrão
			const normalizedVariation =
				typeof variation === 'string' ? { name: variation, values: currentSku[variation] } : variation

			const { name, values } = normalizedVariation

			return {
				variation: name,
				value: values?.[0] || null
			}
		})

		const newDesiredVariation = variationOfCurrentSku.map(variation =>
			variation.variation === skuName ? { variation: skuName, value: valueName } : variation
		)

		onSkuChange(newDesiredVariation)
	}

	const isCurrentSku = (skuName, valueName) => {
		return currentSku?.variations?.some(
			variation => variation?.name === skuName && variation?.values?.[0] === valueName
		)
	}

	const renderOption = (skuName, valueName) => {
		const renderSkuImages =
			App.configs?.appConfigs?.pdp?.preferImageOnSkuSelectFor?.toLocaleLowerCase() ===
			skuName?.toLocaleLowerCase()

		if (renderSkuImages) {
			const findSku = product.items.find(item => item?.[skuName]?.[0] === valueName)
			return (
				<View
					onClick={() => handleSkuChange(skuName, valueName)}
					className='flex items-center'>
					<View
						className={`border ${isCurrentSku(skuName, valueName) ? 'border-primary-content' : 'border-none'}`}>
						<Image
							src={findSku?.images?.[0]?.imageUrl}
							className='max-w-40 max-h-40'
						/>
					</View>
					<Text>{valueName}</Text>
				</View>
			)
		}

		return (
			<View
				onClick={() => handleSkuChange(skuName, valueName)}
				className={`flex items-center gap-2 px-2 py-1 border-2 rounded ${isCurrentSku(skuName, valueName) ? 'border-primary' : 'border-neutral-500'}`}>
				<Text
					className={`${isCurrentSku(skuName, valueName) ? 'text-primary' : 'text-neutral-500'}  font-bold`}>
					{valueName}
				</Text>
			</View>
		)
	}

	if (!(skuVariations?.length > 0)) {
		return null
	}

	return (
		<View className={`flex flex-col gap-2 bg-white rounded shadow-sm border border-gray-300 p-4 w-full`}>
			{skuVariations?.map(sku => (
				<View key={sku?.name}>
					<Text className='text-lg font-semibold'>{`${sku?.name}`}</Text>
					<View className='flex flex-wrap mt-2 gap-2'>
						{sku?.values?.map(value => renderOption(sku.name, value.name))}
					</View>
				</View>
			))}
		</View>
	)
}
