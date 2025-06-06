import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { Loading, HeaderTemplate, HEADER_TYPE } from 'shopping-vtex-template-shared'
import { mountLegacyPath, getProductsByLagacySearch, getProductsService } from '../services/ProductService'
import { useTranslation } from 'eitri-i18n'
import SearchResults from '../components/PageSearchComponents/SearchResults'
import FacetsModal from '../components/FacetsModal/FacetsModal'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
export default function ProductCatalog(props) {
  const { t } = useTranslation()
  const [initialLoading, setInitialLoading] = useState(true)
  const [productLoading, setProductLoading] = useState(false)
  const [windowFilter, setWindowFilter] = useState(false)
  const [facetsModalReady, setFacetsModalReady] = useState(false)
  const [products, setProducts] = useState([])
  const [hasFilters, setHasFilters] = useState(false)
  const [initialFilters, setInitialFilters] = useState(null)
  const [appliedFacets, setAppliedFacets] = useState([]) // Filtros efetivamente usados na busca
  const [currentPage, setCurrentPage] = useState(1)
  const [pagesHasEnded, setPageHasEnded] = useState(false)
  const [viewBackButton, setViewBackButton] = useState(true)
  const legacySearch = Vtex?.configs?.searchOptions?.legacySearch
  useEffect(() => {
    if (props?.location?.state?.backButton) {
      setViewBackButton(JSON.parse(props?.location?.state?.backButton))
    }
    if (legacySearch) {
      setLegacySearchAndGetProducts().catch((e) => {
        console.error('setLegacySearchAndGetProducts', e)
      })
    } else {
      setSearchAndGetProducts()
    }
    Eitri.eventBus.subscribe({
      channel: 'onUserTappedActiveTab',
      callback: (_) => {
        Eitri.navigation.back()
      },
    })
  }, [])
  const onScrollEnd = async () => {
    if (!productLoading && !pagesHasEnded) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      getProducts(appliedFacets, newPage)
    }
  }
  const getProducts = async (appliedFacets, newPage) => {
    if (legacySearch) {
      getProductsByLegacySearch(appliedFacets, newPage)
    } else {
      _getProductsByFacets(appliedFacets, newPage)
    }
  }
  const setSearchAndGetProducts = async () => {
    let params = props?.location?.state?.facets
      ? parsePropsParams(props?.location?.state?.facets)
      : props?.location?.state?.params
    setAppliedFacets(params)
    setInitialFilters(params)
    await _getProductsByFacets(params, currentPage)
    setInitialLoading(false)
  }
  const setLegacySearchAndGetProducts = async () => {
    const facets = props?.location?.state?.params?.facets || props?.location?.state?.facets
    const sort = props?.location?.state?.params?.sort || props?.location?.state?.sort
    const numberOfItems = props?.location?.state?.params?.numberOfItems || props?.location?.state?.numberOfItems || 8
    setAppliedFacets({
      facets,
      sort,
      numberOfItems,
    })
    setCurrentPage(1)
    let path
    try {
      // console.log('facets, numberOfItems, 1, sort', facets, numberOfItems, 1, sort)
      path = mountLegacyPath(facets, numberOfItems, 1, sort)
    } catch (e) {
      console.error('executeLegacyProductSearch, path: ', e)
    }
    try {
      // console.log('path', path)
      const result = await getProductsByLagacySearch(path, 1)
      setProducts(result)
    } catch (e) {
      console.error('executeLegacyProductSearch: ', e)
    }
    setInitialLoading(false)
  }
  const getProductsByLegacySearch = async (options, page) => {
    if (productLoading || pagesHasEnded) return
    setProductLoading(true)
    let path
    try {
      path = mountLegacyPath(options.facets, options.numberOfItems, page, options.sort)
    } catch (e) {
      console.error('executeLegacyProductSearch, path: ', e)
    }
    try {
      const result = await getProductsByLagacySearch(path, page)
      if (result.length === 0) {
        setProductLoading(false)
        setPageHasEnded(true)
        return
      }
      setProducts((prev) => [...prev, ...result])
    } catch (e) {
      console.error('executeLegacyProductSearch: ', e)
    }
    setProductLoading(false)
  }
  const parsePropsParams = (input) => {
    if (!input) return {}
    const segments = input.split('/')
    const result = []
    for (let i = 0; i < segments.length; i += 2) {
      const key = segments[i]
      const value = segments[i + 1]
      result.push({
        key: key,
        value: value,
      })
    }
    return {
      facets: result,
    }
  }
  const _getProductsByFacets = async (selectedFacets, page) => {
    if (productLoading || pagesHasEnded) return
    setProductLoading(true)
    const result = await getProductsService(selectedFacets, page)
    if (result.products.length === 0) {
      setProductLoading(false)
      setPageHasEnded(true)
      return
    }
    setProducts((prev) => [...prev, ...result.products])
    setProductLoading(false)
  }
  const handleFilterModal = () => {
    setWindowFilter(true)
  }
  const goToSearch = () => {
    Eitri.navigation.navigate({
      path: 'Search',
    })
  }
  const filterProductsSubmit = async (filters) => {
    setCurrentPage(1)
    setProducts((_) => [])
    setWindowFilter(false)
    setPageHasEnded(false)
    setHasFilters(JSON.stringify(initialFilters?.facets) !== JSON.stringify(filters?.facets))
    _getProductsByFacets(filters, 1)
  }
  return (
    <Page topInset bottomInset>
      <HeaderTemplate
        headerType={HEADER_TYPE.RETURN_TEXT_FILTER_AND_SEARCH_ICON}
        scrollEffect={true}
        viewBackButton={viewBackButton}
        contentText={props?.location?.state?.title || t('productCatalog.title')}
        hasFilters={hasFilters}
        facetsModalReady={facetsModalReady}
        handleFilterModal={handleFilterModal}
        navigateToSearch={goToSearch}
      />
      <Loading isLoading={initialLoading} fullScreen />
      {!initialLoading && (
        <InfiniteScroll onScrollEnd={onScrollEnd} className="p-2">
          <SearchResults searchResults={products} isLoading={productLoading} />
        </InfiniteScroll>
      )}
      <FacetsModal
        initialFilters={initialFilters}
        onReady={() => setFacetsModalReady(true)}
        onApplyFilters={filterProductsSubmit}
        show={windowFilter}
        onClose={() => setWindowFilter(false)}
      />
    </Page>
  )
}
