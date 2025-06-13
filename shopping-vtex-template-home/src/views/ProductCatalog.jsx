import {
	Loading,
	HeaderTemplate,
	HEADER_TYPE,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	HeaderSearchIcon
} from 'shopping-vtex-template-shared'

import { getProductsService } from '../services/ProductService'
import SearchResults from '../components/PageSearchComponents/SearchResults'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
import HeaderFilter from '../components/HeaderFilter/HeaderFilter'

/*
 * props:
 *
 * params: {
 *  facets: Array<{ key: string, value: string }>
 *  query: string
 *  sort: string
 * }
 * title: string,
 * openInBottomBar: boolean
 * */
export default function ProductCatalog(props) {
	const { location } = props

	const title = location.state.title
	const openInBottomBar = !!location.state.openInBottomBar

	const { t } = useTranslation()

	const [initialLoading, setInitialLoading] = useState(true)
	const [productLoading, setProductLoading] = useState(false)
	const [windowFilter, setWindowFilter] = useState(false)
	const [products, setProducts] = useState([])
	const [initialFilters, setInitialFilters] = useState(null)
	const [hasFilters, setHasFilters] = useState(false)
	const [appliedFacets, setAppliedFacets] = useState([]) // Filtros efetivamente usados na busca
	const [currentPage, setCurrentPage] = useState(1)
	const [pagesHasEnded, setPageHasEnded] = useState(false)

	useEffect(() => {
		const params =
			location.state.params ??
			(location.state.facets ? parseLegacyPropsParams(location.state.facets) : { facets: [] })

		setSearchAndGetProducts(params)

		if (!openInBottomBar) {
			Eitri.eventBus.subscribe({
				channel: 'onUserTappedActiveTab',
				callback: _ => {
					Eitri.navigation.back()
				}
			})
		}
	}, [])

	const onScrollEnd = async () => {
		if (!productLoading && !pagesHasEnded) {
			const newPage = currentPage + 1
			getProducts(appliedFacets, newPage)
		}
	}

	const getProducts = async (appliedFacets, newPage) => {
		_getProductsByFacets(appliedFacets, newPage)
	}

	const setSearchAndGetProducts = async params => {
		setAppliedFacets(params)
		setInitialFilters(params)

		await _getProductsByFacets(params, currentPage)

		setInitialLoading(false)
	}

	const _getProductsByFacets = async (selectedFacets, page) => {
		if (productLoading || pagesHasEnded) return

		setProductLoading(true)

		const result = await getProductsService(selectedFacets, page)

		if (result?.products?.length === 0) {
			setProductLoading(false)
			setPageHasEnded(true)
			return
		}

		if (result?.products?.length > 0) {
			setProducts(prev => [...prev, ...result?.products])
		}
		setCurrentPage(page)
		setProductLoading(false)
	}

	const handleFilterModal = () => {
		setWindowFilter(true)
	}

	const goToSearch = () => {
		Eitri.navigation.navigate({ path: 'Search' })
	}

	const filterProductsSubmit = async filters => {
		setCurrentPage(1)
		setProducts(_ => [])
		setWindowFilter(false)
		setPageHasEnded(false)
		setHasFilters(JSON.stringify(initialFilters?.facets) !== JSON.stringify(filters?.facets))
		_getProductsByFacets(filters, 1)
	}

	const parseLegacyPropsParams = input => {
		if (!input) return {}

		const segments = input.split('/')
		const result = []

		for (let i = 0; i < segments.length; i += 2) {
			const key = segments[i]
			const value = segments[i + 1]
			result.push({ key: key, value: value })
		}

		return { facets: result }
	}

	const onClearFilter = async () => {
		setAppliedFacets(initialFilters)
		filterProductsSubmit(initialFilters)
	}

	return (
		<Page
			topInset
			bottomInset>
			<>
				<HeaderContentWrapper className={`justify-between`}>
					<View className={`flex items-center gap-[12px]`}>
						{!openInBottomBar && <HeaderReturn />}

						<HeaderText text={title || t('productCatalog.title')} />
					</View>

					<View className={`flex items-center gap-[12px]`}>
						<HeaderSearchIcon onPress={goToSearch} />

						<HeaderFilter
							initialParams={initialFilters}
							currentParams={appliedFacets}
							onApplyFilters={filterProductsSubmit}
							onClearFilters={onClearFilter}
						/>
					</View>
				</HeaderContentWrapper>

				<Loading
					isLoading={initialLoading}
					fullScreen
				/>

				{!initialLoading && (
					<InfiniteScroll
						padding={'small'}
						onScrollEnd={onScrollEnd}>
						<SearchResults
							searchResults={products}
							isLoading={productLoading}
						/>
					</InfiniteScroll>
				)}
			</>
		</Page>
	)
}
