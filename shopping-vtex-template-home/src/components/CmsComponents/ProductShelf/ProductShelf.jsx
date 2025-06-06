import { Vtex } from 'eitri-shopping-vtex-shared'
import { getProductsByFacets, getProductsByLagacySearch, mountLegacyPath } from '../../../services/ProductService'
import ShelfOfProducts from '../../ShelfOfProducts/ShelfOfProducts'
export default function ProductShelf(props) {
  const { data } = props
  const [currentProducts, setCurrentProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)
  const [searchParams, setSearchParams] = useState()
  useEffect(() => {
    executeProductSearch()
  }, [])
  const executeProductSearch = async () => {
    if (Vtex?.configs?.searchOptions?.legacySearch) {
      return executeLegacyProductSearch()
    }
    return executeProductInteligentSearch()
  }
  const executeProductInteligentSearch = async () => {
    setIsLoadingProducts(true)
    let query = {}
    if (data.term) {
      query = {
        q: data.term,
      }
    }
    const processedFacets = processFacets(data)
    const processedSort = processSort(data)
    const processedPagination = processPagination(data)
    const _searchOptions = {
      ...processedSort,
      ...processedPagination,
      ...query,
    }
    const result = await getProductsByFacets(processedFacets, _searchOptions)
    setCurrentProducts(result.products)
    setSearchParams({
      facets: data?.selectedFacets,
      ..._searchOptions,
    })
    setIsLoadingProducts(false)
  }
  const executeLegacyProductSearch = async () => {
    let path
    try {
      path = mountLegacyPath(data.selectedFacets, data.numberOfItems, 1, data.sort)
    } catch (e) {
      console.error('executeLegacyProductSearch, path: ', e)
    }
    try {
      // console.log('path', path)
      const result = await getProductsByLagacySearch(path, 1)
      setCurrentProducts(result)
      setSearchParams({
        facets: data?.selectedFacets,
        sort: data?.sort,
        numberOfItems: data?.numberOfItems,
      })
    } catch (e) {
      console.error('executeLegacyProductSearch: ', e)
    }
    setIsLoadingProducts(false)
  }
  const processFacets = (shelf) => {
    if (!shelf?.selectedFacets) return ''
    return shelf?.selectedFacets?.reduce((acc, facet) => {
      acc += `/${facet.key}/${facet.value}`
      return acc
    }, '')
  }
  const processSort = (shelf) => {
    if (!shelf?.sort || shelf?.sort === 'score_desc') return {}
    return {
      sort: shelf?.sort?.replace('_', ':'),
    }
  }
  const processPagination = (shelf) => {
    const { numberOfItems } = shelf
    return {
      count: numberOfItems || 8,
    }
  }
  return (
    <ShelfOfProducts
      mode="carousel"
      title={data?.title}
      isLoading={isLoadingProducts}
      products={currentProducts}
      searchParams={searchParams}
    />
  )
}
