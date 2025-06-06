import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { HEADER_TYPE } from 'shopping-vtex-template-shared'
import HeaderTemplate from '../components/Header/HeaderTemplate'
import { mountLegacyPath, getProductsByLagacySearch, getProductsService } from '../services/ProductService'
import SearchInput from '../components/SearchInput/SearchInput'
import PristineView from '../components/PageSearchComponents/PristineView'
import SearchResults from '../components/PageSearchComponents/SearchResults'
import FacetsModal from '../components/FacetsModal/FacetsModal'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
export default function Search(props) {
  const incomingSearchTerm = props?.history?.location?.state?.searchTerm || props?.location?.state?.searchTerm
  const [isProductLoading, setIsProductLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [searchResults, setSearchResults] = useState([])
  const [isPristine, setIsPristine] = useState(true)
  const [initialFilters, setInitialFilters] = useState(null)
  const [pagesHasEnded, setPageHasEnded] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [facetsModalReady, setFacetsModalReady] = useState(false)
  const [appliedFacets, setAppliedFacets] = useState([])
  const [hasFilters, setHasFilters] = useState(false)
  const legacySearch = Vtex?.configs?.searchOptions?.legacySearch
  useEffect(() => {
    if (incomingSearchTerm) {
      if (legacySearch) {
        setLegacySearchAndGetProducts(incomingSearchTerm)
      } else {
        setSearchAndGetProducts(incomingSearchTerm)
      }
    }
    Eitri.eventBus.subscribe({
      channel: 'onUserTappedActiveTab',
      callback: (_) => {
        Eitri.navigation.backToTop()
      },
    })
  }, [])
  const onScrollEnd = async () => {
    if (!isProductLoading && !pagesHasEnded) {
      const newPage = page + 1
      setPage(newPage)
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
  const setSearchAndGetProducts = async (incomingSearchTerm) => {
    const params = {
      facets: [],
      query: incomingSearchTerm,
      sort: 'orders:desc',
    }
    setAppliedFacets(params)
    setInitialFilters(params)
    setIsPristine(false)
    _getProductsByFacets(params, 1)
  }
  const setLegacySearchAndGetProducts = async (searchTerm) => {
    const sort = 'orders_desc'
    setAppliedFacets({
      searchTerm,
      sort,
    })
    await getProductsByLegacySearch(
      {
        searchTerm,
        sort,
      },
      1,
      true,
    )
    setIsPristine(false)
  }
  const handleSearchSubmit = async (term) => {
    if (term) {
      Eitri.keyboard.dismiss()
      if (legacySearch) {
        setIsPristine(true)
        return setLegacySearchAndGetProducts(term)
      } else {
        try {
          const params = {
            sort: 'orders:desc',
            facets: [],
            query: term,
          }
          setAppliedFacets(params)
          setInitialFilters(params)
          setSearchResults([])
          setIsPristine(false)
          setPageHasEnded(false)
          setPage(1)
          _getProductsByFacets(params, page)
        } catch (error) {
          console.log('handleSearchSubmit', error)
        }
      }
    }
  }
  const getProductsByLegacySearch = async (options, page, replace) => {
    setIsProductLoading(true)
    const numberOfItems = 12
    try {
      const path = mountLegacyPath(`ft=${options?.searchTerm}`, numberOfItems, page, options?.sort)
      const result = await getProductsByLagacySearch(path, page)
      if (result.length === 0) {
        setIsProductLoading(false)
        setPageHasEnded(true)
        return
      }
      if (replace) {
        setSearchResults(result)
      } else {
        setSearchResults((prev) => [...prev, ...result])
      }
    } catch (e) {
      console.log('erro', e)
    }
    setIsProductLoading(false)
  }
  const _getProductsByFacets = async (selectedFacets, page) => {
    setIsProductLoading(true)
    try {
      const result = await getProductsService(selectedFacets, page)
      if (result.products.length === 0) {
        setIsProductLoading(false)
        setPageHasEnded(true)
        return
      }
      setSearchResults((prev) => [...prev, ...result.products])
      setIsProductLoading(false)
    } catch (e) {
      console.error('Erro ao buscar produtos', e)
    }
  }
  const onApplyFilter = async (filters) => {
    setPage(1)
    setSearchResults((_) => [])
    setShowFilterModal(false)
    setHasFilters(JSON.stringify(initialFilters?.facets) !== JSON.stringify(filters?.facets))
    _getProductsByFacets(filters, 1)
  }
  const handleFilterModal = () => {
    setFacetsModalReady(true)
    setShowFilterModal(true)
  }
  return (
    <Page bottomInset topInset>
      <HeaderTemplate
        headerType={HEADER_TYPE.SEARCH_INPUT_AND_FILTER}
        scrollEffect={true}
        filterFacets={initialFilters}
        facetsModalReady={facetsModalReady}
        hasFilters={hasFilters}
        handleFilterModal={handleFilterModal}
      >
        <SearchInput incomingValue={incomingSearchTerm} onSubmit={handleSearchSubmit} />
      </HeaderTemplate>
      <View className="mt-[150px]" />
      {isPristine ? (
        <PristineView />
      ) : (
        <InfiniteScroll onScrollEnd={onScrollEnd} className="p-2">
          <SearchResults searchResults={searchResults} isLoading={isProductLoading} />
        </InfiniteScroll>
      )}
      {initialFilters && (
        <FacetsModal
          initialFilters={initialFilters}
          onReady={() => setFacetsModalReady(true)}
          onApplyFilters={onApplyFilter}
          show={showFilterModal}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </Page>
  )
}
