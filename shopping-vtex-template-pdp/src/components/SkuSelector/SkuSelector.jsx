import { useMemo, useState } from 'react'
import { RemoteConfig } from 'eitri-shopping-vtex-shared'
import { sortSku } from '../../utils/skuSort'

// Get unique values per attribute
function getUniqueValues(skus, key) {
	return [...new Set(skus.map(s => s.attributes[key]))]
}

// Given current selections (excluding the key being evaluated),
// returns a map of value -> { exists, availableExists }
function getOptionStatus(skus, attributeKeys, key, selections) {
	const otherKeys = attributeKeys.filter(k => k !== key)
	const values = getUniqueValues(skus, key)

	return values.reduce((acc, value) => {
		const matching = skus.filter(s => {
			if (s.attributes[key] !== value) return false

			return otherKeys.every(k => !selections[k] || s.attributes[k] === selections[k])
		})

		acc[value] = {
			exists: matching.length > 0,
			availableExists: matching.some(s => s.available)
		}

		return acc
	}, {})
}

// Find selected SKU
function findSelectedSku(skus, attributeKeys, selections) {
	if (Object.keys(selections).length < attributeKeys.length) return null

	return skus.find(s => attributeKeys.every(k => s.attributes[k] === selections[k])) || null
}

const COR_MAP = {
	Azul: '#3b5bdb',
	Vermelho: '#e03131',
	Verde: '#2f9e44',
	Preto: '#212529',
	Branco: '#f8f9fa',
	Amarelo: '#f59f00',
	Rosa: '#e64980',
	Cinza: '#868e96'
}

function ColorSwatch({ color, selected, status, onClick }) {
	const hex = COR_MAP[color]
	const unavailable = !status.availableExists
	const inexistent = !status.exists

	return (
		<View
			onClick={onClick}
			className={`
				relative w-10 h-10 rounded-full cursor-pointer transition-all duration-200
				flex items-center justify-center
				${selected ? 'ring-2 ring-offset-2 ring-gray-900 scale-110' : ''}
				${unavailable && !inexistent ? 'opacity-50' : ''}
				${inexistent ? 'opacity-20 cursor-not-allowed' : ''}
			`}
			style={{ backgroundColor: hex || '#aaa' }}>
			{unavailable && !inexistent && (
				<View className='absolute inset-0 flex items-center justify-center rounded-full overflow-hidden'>
					<View className='absolute w-[120%] h-[1.5px] bg-white opacity-70 rotate-45' />
				</View>
			)}
		</View>
	)
}

function OptionChip({ value, selected, status, onClick }) {
	const unavailable = !status.availableExists
	const inexistent = !status.exists

	return (
		<View
			onClick={!inexistent ? onClick : undefined}
			className={`
				relative px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 select-none
				${inexistent ? 'opacity-20 cursor-not-allowed border-gray-200 text-gray-400' : 'cursor-pointer'}
				${
					selected
						? 'bg-primary text-primary-content border-primary'
						: unavailable && !inexistent
							? 'bg-white text-gray-400 border-gray-200'
							: 'bg-white text-gray-800 border-gray-300 active:bg-gray-50'
				}
			`}>
			<Text>{value}</Text>

			{unavailable && !inexistent && (
				<View className='absolute inset-0 flex items-center justify-center rounded-lg overflow-hidden pointer-events-none'>
					<View className='absolute w-full h-[1.5px] bg-gray-300 rotate-12' />
				</View>
			)}
		</View>
	)
}

export default function SkuSelector(props) {
	const { product, currentSku, onSkuChange } = props

	const [selections, setSelections] = useState({})

	useEffect(() => {
		if (!currentSku?.variations?.length) {
			setSelections({})

			return
		}

		const currentSelection = currentSku?.variations?.reduce((acc, variation) => {
			if (variation.name && variation.values?.[0]) {
				acc[variation.name] = variation.values[0]
			}

			return acc
		}, {})

		setSelections(currentSelection)
	}, [currentSku])

	const skus = useMemo(() => {
		const hiddenVariations = RemoteConfig.getContent('appConfigs.pdp.hiddenVariations') || []

		const res = product?.items?.map(item => {
			const sellerDefault = item?.sellers?.find(s => s.sellerDefault) ?? item.sellers[0]

			return {
				itemId: item.itemId,
				available: sellerDefault.commertialOffer.AvailableQuantity > 0,
				attributes: item?.variations?.reduce((acc, item) => {
					if (hiddenVariations?.includes(item.name)) return acc

					acc[item.name] = item.values?.[0] ?? null

					return acc
				}, {})
			}
		})

		return res?.filter(sku => Object.keys(sku.attributes).length > 0)
	}, [product])

	const attributeKeys = useMemo(() => (skus?.length > 0 ? Object.keys(skus[0].attributes) : []), [skus])

	const handleSelect = (key, value) => {
		const isSame = selections[key] === value

		if (isSame) return

		const next = { ...selections, [key]: value }
		const newSku = findSelectedSku(skus, attributeKeys, next)

		onSkuChange?.(newSku)
	}

	if (attributeKeys.length === 0) return null

	return (
		<View className='flex flex-col gap-4 bg-white rounded shadow-sm border border-gray-300 p-4 w-full'>
			{attributeKeys.map(key => {
				const values = getUniqueValues(skus, key)
				const statusMap = getOptionStatus(skus, attributeKeys, key, selections)
				// const isCor = key === 'Cor'

				const isCor = false // Precisa especificar melhor o tratamento de cores... forcando pra renderizar como Chip

				return (
					<View key={key}>
						<View className='flex items-center gap-2 mb-3'>
							<Text className='text-lg font-semibold text-gray-700 capitalize'>{key}</Text>

							{selections[key] && (
								<Text className='text-sm text-gray-400'>
									— <Text className='text-gray-600'>{selections[key]}</Text>
								</Text>
							)}
						</View>

						{isCor ? (
							<View className='flex flex-wrap gap-3'>
								{values.map(value => (
									<ColorSwatch
										key={value}
										color={value}
										selected={selections[key] === value}
										status={statusMap[value]}
										onClick={() => handleSelect(key, value)}
									/>
								))}
							</View>
						) : (
							<View className='flex flex-wrap gap-2'>
								{sortSku(values).map(value => (
									<OptionChip
										key={value}
										value={value}
										selected={selections[key] === value}
										status={statusMap[value]}
										onClick={() => handleSelect(key, value)}
									/>
								))}
							</View>
						)}
					</View>
				)
			})}
		</View>
	)
}
