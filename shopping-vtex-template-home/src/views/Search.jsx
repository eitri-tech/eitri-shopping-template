import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderCart, HeaderReturn } from 'shopping-vtex-template-shared'
import { autocompleteSuggestions, getProductsService } from '../services/ProductService'
import SearchInput from '../components/SearchInput/SearchInput'
import SearchResults from '../components/PageSearchComponents/SearchResults'
import { useLocalShoppingCart } from '../providers/LocalCart'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
import HeaderFilter from '../components/HeaderFilter/HeaderFilter'
import searchIcon from '../assets/icons/search-normal.svg'

export default function Search(props) {
	const incomingSearchTerm = props?.history?.location?.state?.searchTerm || props?.location?.state?.searchTerm

	const { cart } = useLocalShoppingCart()

	const [isProductLoading, setIsProductLoading] = useState(false)
	const [page, setPage] = useState(1)

	const [searchResults, setSearchResults] = useState([])
	const [pagesHasEnded, setPageHasEnded] = useState(true)
	const [params, setParams] = useState(null)
	const [initialParams, setInitialParams] = useState(null)
	const [pristine, setPristine] = useState(true)
	const [searchSuggestion, setSearchSuggestion] = useState([])

	useEffect(() => {
		if (incomingSearchTerm) {
			setSearchAndGetProducts(incomingSearchTerm)
		}

		Eitri.eventBus.subscribe({
			channel: 'onUserTappedActiveTab',
			callback: _ => {
				Eitri.navigation.backToTop()
			}
		})

		// Tracking.screenView('busca', 'Search')
	}, [])

	const onScrollEnd = async () => {
		if (!isProductLoading && !pagesHasEnded) {
			const newPage = page + 1
			setPage(newPage)
			getProducts(params, newPage)
		}
	}

	const getProducts = async (params, newPage) => {
		_getProductsByFacets(params, newPage)
	}

	const setSearchAndGetProducts = async incomingSearchTerm => {
		// Tracking.search(incomingSearchTerm)
		const params = {
			facets: [],
			query: incomingSearchTerm,
			sort: 'orders:desc'
		}

		setParams(params)
		setInitialParams({ ...params })

		_getProductsByFacets(params, 1)
	}

	const handleSearchSubmit = async term => {
		if (term) {
			Eitri.keyboard.dismiss()
			try {
				const params = {
					sort: 'orders:desc',
					facets: [],
					query: term
				}
				setParams(params)
				setInitialParams({ ...params })
				setSearchResults([])
				setPageHasEnded(false)
				setPage(1)
				setSearchSuggestion([])
				_getProductsByFacets(params, page)
			} catch (error) {
				console.log('handleSearchSubmit', error)
			}
		}
	}

	const _getProductsByFacets = async (selectedFacets, page) => {
		setIsProductLoading(true)

		try {
			setPristine(false)
			const result = await getProductsService(selectedFacets, page)

			if (result?.products?.length === 0) {
				setIsProductLoading(false)
				setPageHasEnded(true)
				return
			}

			setSearchResults(prev => [...prev, ...result?.products])
			setIsProductLoading(false)
		} catch (e) {
			console.log('erro', e)
			// Tracking.error(e, 'search.getProductsByFacets')
		}
	}

	const onApplyFilter = async filters => {
		setPage(1)
		setSearchResults(_ => [])
		setParams(filters)
		_getProductsByFacets(filters, 1)
	}

	const onClearFilter = async () => {
		setParams(initialParams)
		onApplyFilter(initialParams)
	}

	const onChangeTerm = async term => {
		if (term) {
			try {
				const params = {
					sort: 'orders:desc',
					facets: [],
					query: term
				}

				if (!term) {
					setSearchSuggestion([])
					return
				}
				const result = await autocompleteSuggestions(term)
				setSearchSuggestion(result?.searches)

				setSearchResults([])
				setPageHasEnded(false)
				setPage(1)
				_getProductsByFacets(params, page)
			} catch (error) {
				console.log('handleSearchSubmit', error)
			}
		}
	}

	return (
		<Page
			title='Tela de busca'
			bottomInset
			topInset>
			<HeaderContentWrapper scrollEffect={false}>
				<HeaderReturn />
				<SearchInput
					incomingValue={params?.query}
					onSubmit={handleSearchSubmit}
					onChange={onChangeTerm}
				/>

				<View
					display='flex'
					gap={12}>
					<HeaderFilter
						initialParams={initialParams}
						currentParams={params}
						onApplyFilters={onApplyFilter}
						onClearFilters={onClearFilter}
					/>

					<HeaderCart cart={cart} />
				</View>
			</HeaderContentWrapper>

			{searchSuggestion && searchSuggestion.length > 0 && (
				<View
					marginTop='quark'
					width='100vw'
					customColor='#fdfdfd'
					direction='column'>
					{searchSuggestion.map((suggestion, key) => (
						<View
							key={suggestion.term}
							borderBottomWidth='hairline'
							borderColor='neutral-300'
							borderWidth='none'
							width='100%'
							paddingHorizontal='display'
							paddingVertical='large'
							display='flex'
							justifyContent='between'
							alignItems='center'
							onClick={() => {
								handleSearchSubmit(suggestion.term)
							}}>
							<View
								display='flex'
								gap={12}>
								<Image
									src={searchIcon}
									width='16px'
								/>
								<Text
									color='neutral-900'
									fontSize='medium'
									width='100%'>
									{suggestion.term}
								</Text>
							</View>
						</View>
					))}
				</View>
			)}

			{!pristine && (
				<View padding={'small'}>
					<InfiniteScroll onScrollEnd={onScrollEnd}>
						<SearchResults
							isLoading={isProductLoading}
							searchResults={searchResults}
						/>
					</InfiniteScroll>
				</View>
			)}
		</Page>
	)
}
