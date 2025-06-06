import CategoryPageModal from '../CategoryPageModal/CategoryPageModal'
import { LIST_ORDERING } from '../../utils/lists'
import { getPossibleByFacets } from '../../services/ProductService'
import { useTranslation } from 'eitri-i18n'
import { formatPrice } from '../../utils/Util'
export default function FacetsModal(props) {
  const { show, onClose, onReady, initialFilters, onApplyFilters } = props
  const [facetsLoading, setFacetsLoading] = useState(false)
  const [filterFacets, setFilterFacets] = useState(null)
  const [_currentFacets, setCurrentFacets] = useState(null)
  const { t } = useTranslation()
  useEffect(() => {
    if (initialFilters) {
      setCurrentFacets(initialFilters)
      loadFacetsOptions(initialFilters).then(() => {
        onReady()
      })
    }
  }, [initialFilters])
  const loadFacetsOptions = async (selectedFacets) => {
    setFacetsLoading(true)
    const facetsPath = selectedFacets?.facets?.map((facet) => `${facet.key}/${facet.value}`).join('/')
    const facets = await getPossibleByFacets(facetsPath, {
      query: selectedFacets?.query || '',
    })
    setFilterFacets(generateFilters(facets))
    setFacetsLoading(false)
  }
  const generateFilters = (facetQueryResult) => {
    return facetQueryResult.facets
      .filter((facet) => !facet.hidden)
      .map((facet) => {
        if (facet.type === 'PRICERANGE') {
          return {
            ...facet,
            values: facet.values.map((value) => {
              return {
                ...value,
                name: `${t('facetsModal.from')} ${formatPrice(value?.range?.from)} ${t('facetsModal.to')} ${formatPrice(value.range.to)}`,
                value: `${value.range.from}:${value.range.to}`,
              }
            }),
          }
        } else {
          return facet
        }
      })
  }
  const addCategory = async (newCategory) => {
    const _withoutCategory = _currentFacets?.facets?.filter((item) => item.key !== newCategory.key)
    const _newCategory = {
      ..._currentFacets,
      facets: [..._withoutCategory, newCategory],
    }
    setCurrentFacets(_newCategory)
    loadFacetsOptions(_newCategory)
  }
  const removeCategory = async (categoryToBeRemoved) => {
    const _withoutCategory = _currentFacets?.facets?.filter((item) => item.key !== categoryToBeRemoved.key)
    const _newCategory = {
      ..._currentFacets,
      facets: _withoutCategory,
    }
    setCurrentFacets(_newCategory)
    loadFacetsOptions(_newCategory)
  }
  const addOrdering = async (order) => {
    const _newCategory = {
      ..._currentFacets,
      sort: order.value,
    }
    setCurrentFacets(_newCategory)
  }
  const _onApplyFilters = () => {
    onApplyFilters(_currentFacets)
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
      values: LIST_ORDERING.values.map((value) => ({
        ...value,
        name: t(value.name),
        checked: value.value === _currentFacets?.sort,
      })),
    }
  }
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
