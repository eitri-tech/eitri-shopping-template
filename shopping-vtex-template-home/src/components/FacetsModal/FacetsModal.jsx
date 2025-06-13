import CategoryPageModal from '../CategoryPageModal/CategoryPageModal'
import { LIST_ORDERING } from '../../utils/lists'
import { getProductsFacetsService } from '../../services/ProductService'
import { useTranslation } from 'eitri-i18n'
import { formatPrice } from '../../utils/utils'
import CModal from '../CModal/CModal'
import { CustomButton } from 'shopping-vtex-template-shared'

export default function FacetsModal(props) {
	const { show, onClose, modalReady, initialFilters, onApplyFilters } = props
	const [facetsLoading, setFacetsLoading] = useState(false)
	const [filterFacets, setFilterFacets] = useState(null)
	const [_currentFacets, setCurrentFacets] = useState(null)

	const [preFilter, setPreFilters] = useState({ facets: [] })

	const { t } = useTranslation()

	useEffect(() => {
		if (initialFilters) {
			setCurrentFacets(initialFilters)
			loadFacetsOptions(initialFilters).then(() => {
				modalReady()
			})
		}
	}, [initialFilters])

	const loadFacetsOptions = async selectedFacets => {
		setFacetsLoading(true)
		const result = await getProductsFacetsService(selectedFacets)
		setFilterFacets(result)
		setFacetsLoading(false)
	}

	const generateFilters = facetQueryResult => {
		return facetQueryResult.facets
			.filter(facet => !facet.hidden)
			.map(facet => {
				if (facet.type === 'PRICERANGE') {
					return {
						...facet,
						values: facet.values.map(value => {
							return {
								...value,
								name: `${t('facetsModal.from')} ${formatPrice(value?.range?.from)} ${t('facetsModal.to')} ${formatPrice(value.range.to)}`,
								value: `${value.range.from}:${value.range.to}`
							}
						})
					}
				} else {
					return facet
				}
			})
	}

	const addCategory = async newCategory => {
		const _withoutCategory = _currentFacets?.facets?.filter(item => item.key !== newCategory.key)
		const _newCategory = {
			..._currentFacets,
			facets: [..._withoutCategory, newCategory]
		}
		setCurrentFacets(_newCategory)
		loadFacetsOptions(_newCategory)
	}

	const removeCategory = async categoryToBeRemoved => {
		const _withoutCategory = _currentFacets?.facets?.filter(item => item.key !== categoryToBeRemoved.key)
		const _newCategory = {
			..._currentFacets,
			facets: _withoutCategory
		}
		setCurrentFacets(_newCategory)
		loadFacetsOptions(_newCategory)
	}

	const addOrdering = async order => {
		const _newCategory = {
			..._currentFacets,
			sort: order.value
		}
		setCurrentFacets(_newCategory)
	}

	const _onApplyFilters = () => {
		onApplyFilters(preFilter)
	}

	const _onRemoveFilters = () => {
		setCurrentFacets(initialFilters)
		onApplyFilters(initialFilters)
		loadFacetsOptions(initialFilters)
	}

	const getSortOptions = () => {
		return {
			...LIST_ORDERING,
			title: t(LIST_ORDERING.title),
			values: LIST_ORDERING.values.map(value => ({
				...value,
				name: t(value.name),
				checked: value.value === _currentFacets?.sort
			}))
		}
	}

	const onSelectFacet = (key, value) => {
		const facets = preFilter?.facets || []
		const index = facets.findIndex(f => f.key === key && f.value === value)

		let newFacets

		if (index > -1) {
			newFacets = facets.filter((_, i) => i !== index)
		} else {
			newFacets = [...facets, { key, value }]
		}

		setPreFilters({ ...preFilter, facets: newFacets })
		loadFacetsOptions({ ...preFilter, facets: newFacets })

		// return newFacets
	}

	const isSelected = (key, value) => {
		const facets = preFilter?.facets || []
		return facets.some(f => f.key === key && f.value === value)
	}

	if (filterFacets?.length === 0 || !show) {
		return null
	}

	return (
		<CModal>
			<View className='bg-white w-full max-w-md rounded-t-xl p-4 max-h-[80vh] overflow-y-auto'>
				<Text className='text-base font-semibold'>Filtrar por</Text>
				<View className='flex flex-col gap-4'>
					{filterFacets?.map(facet => (
						<View key={facet.key}>
							<Text className='text-sm font-normal'>{facet.name}</Text>
							<View className='flex flex-wrap gap-2 mt-2'>
								{facet.values.map(value => (
									<View
										onClick={() => onSelectFacet(value.key, value.value)}
										key={`${facet.key}-${value.value}`}
										className={`px-3 py-1 rounded-full ${isSelected(value.key, value.value) ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'} text-sm`}>
										<Text>{value.name}</Text>
									</View>
								))}
							</View>
						</View>
					))}
				</View>
				<View className='flex gap-4 mt-2'>
					<CustomButton
						variant={'outlined'}
						label={t('categoryPageModal.clear')}
					/>
					<CustomButton
						onClick={_onApplyFilters}
						label={t('categoryPageModal.button')}
					/>
				</View>
			</View>
		</CModal>
	)

	return (
		<>
			{filterFacets?.length > 0 && (
				<CategoryPageModal
					show={show}
					onClose={onClose}
					facets={filterFacets}
					facetsLoading={facetsLoading}
					removeFilter={removeCategory}
					addFilter={addCategory}
					clearFilters={_onRemoveFilters}
					executeSearch={_onApplyFilters}
					listOrdering={getSortOptions()}
					addOrdering={addOrdering}
				/>
			)}
		</>
	)
}
