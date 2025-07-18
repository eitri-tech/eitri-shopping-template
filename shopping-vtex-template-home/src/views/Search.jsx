import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderCart, HeaderReturn, HeaderWishList } from 'shopping-vtex-template-shared'
import { autocompleteSuggestions, getProductsService } from '../services/ProductService'
import SearchInput from '../components/SearchInput/SearchInput'
import SearchResults from '../components/PageSearchComponents/SearchResults'
import { useLocalShoppingCart } from '../providers/LocalCart'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
import HeaderFilter from '../components/HeaderFilter/HeaderFilter'
import searchIcon from '../assets/icons/search-normal.svg'

export default function Search(props) {
	const incomingSearchTerm = props?.history?.location?.state?.searchTerm || props?.location?.state?.searchTerm

	const { cart, startCart } = useLocalShoppingCart()

	const [isProductLoading, setIsProductLoading] = useState(false)
	const [page, setPage] = useState(1)

	const [searchResults, setSearchResults] = useState([])
	const [pagesHasEnded, setPageHasEnded] = useState(true)
	const [params, setParams] = useState(null)
	const [initialParams, setInitialParams] = useState(null)
	const [pristine, setPristine] = useState(true)
	const [searchSuggestion, setSearchSuggestion] = useState([])
	const [totalProducts, setTotalProducts] = useState(null)

	useEffect(() => {
		window.scroll(0, 0)

		if (incomingSearchTerm) {
			setSearchAndGetProducts(incomingSearchTerm)
		}

		startCart()

		Eitri.eventBus.subscribe({
			channel: 'onUserTappedActiveTab',
			callback: _ => {
				Eitri.navigation.backToTop()
			}
		})

		Eitri.navigation.setOnResumeListener(() => {
			startCart()
		})

		Tracking.screenView('busca', 'Search')
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
		Tracking.search(incomingSearchTerm)

		const params = {
			facets: [],
			query: incomingSearchTerm,
			sort: 'release:desc'
		}

		setParams(params)
		setInitialParams({ ...params })
		setPageHasEnded(false)
		setPristine(false)
		setPage(1)

		await _getProductsByFacets(params, 1)
	}

	const handleSearchSubmit = async term => {
		if (term) {
			Eitri.keyboard.dismiss()
			try {
				const params = {
					sort: 'release:desc',
					facets: [],
					query: term
				}
				saveSearchHistory(term)
				setParams(params)
				setInitialParams({ ...params })
				setSearchResults([])
				setPageHasEnded(false)
				setPage(1)
				setSearchSuggestion([])
				setPristine(false)
				await _getProductsByFacets(params, 1)
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

			setTotalProducts(result.recordsFiltered)
			if (result?.products?.length === 0) {
				setIsProductLoading(false)
				setPageHasEnded(true)
				return
			} else {
				Tracking.appsFlyerEvent('af_search', {
					af_search_term: selectedFacets.query,
					af_content_list: result.products.map(item => item.productId)
				})
			}

			if (page === 1) {
				// Se for a primeira página, substitui os resultados
				setSearchResults(result?.products || [])
			} else {
				// Se for páginas subsequentes, adiciona aos resultados existentes
				setSearchResults(prev => [...prev, ...result?.products])
			}

			setPageHasEnded(result?.products?.length === 0)
			setIsProductLoading(false)
		} catch (e) {
			console.log('erro', e)
			setIsProductLoading(false)
			setPageHasEnded(true)
			Tracking.error(e, 'search.getProductsByFacets')
		}
	}

	const onApplyFilter = async filters => {
		setPage(1)
		setSearchResults([])
		setPageHasEnded(false)
		setPristine(false)
		setParams(filters)
		await _getProductsByFacets(filters, 1)
	}

	const onClearFilter = async () => {
		setParams(initialParams)
		await onApplyFilter(initialParams)
	}

	const onChangeTerm = async term => {
		if (term) {
			try {
				const params = {
					sort: 'release:desc',
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
				await _getProductsByFacets(params, 1)
			} catch (error) {
				console.log('handleSearchSubmit', error)
			}
		}
	}

	const [facetsModalReady, setFacetsModalReady] = useState(false)
	const [showModal, setShowModal] = useState(false)
	const [modeModal, setModeModal] = useState('')

	const handleFilterModal = mode => {
		setShowModal(true)
		setModeModal(mode)
	}

	const _onApplyFilters = async filters => {
		await onApplyFilter(filters)
		setShowModal(false)
		setModeModal('')
	}

	const _onRemoveFilters = async () => {
		await onClearFilter()
		setShowModal(false)
		setModeModal('')
	}

	return (
		<Page
			title='Tela de busca'
			bottomInset
			topInset>
			<HeaderContentWrapper scrollEffect={false}>
				<View
					display='flex'
					alignItems='center'
					gap={12}>
					<HeaderReturn iconColor='primary-500' />

					<SearchInput
						incomingValue={params?.query}
						onSubmit={handleSearchSubmit}
						onChange={onChangeTerm}
					/>

					<View
						display='flex'
						gap={12}>
						<HeaderWishList
							onPress={() => {}}
							padding='none'
						/>

						<HeaderCart cart={cart} />
					</View>
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

							<View>
								<Image
									src={linkIcon}
									width='12px'
								/>
							</View>
						</View>
					))}
				</View>
			)}

			{!pristine && (
				<View
					padding={'small'}
					direction='column'
					gap={12}>
					<View
						direction='row'
						justifyContent='between'
						gap={12}>
						<View
							onPress={() => handleFilterModal('filter')}
							paddingVertical='extra-small'
							backgroundColor='accent-100'
							width='100%'
							borderWidth='hairline'
							borderColor='neutral-300'
							direction='row'
							justifyContent='center'
							alignItems='center'
							borderRadius='micro'>
							<Text>Filtrar</Text>
						</View>
						<View
							onPress={() => handleFilterModal('order')}
							paddingVertical='extra-small'
							backgroundColor='accent-100'
							width='100%'
							borderWidth='hairline'
							borderColor='neutral-300'
							direction='row'
							justifyContent='center'
							alignItems='center'
							borderRadius='micro'>
							<Text>Ordenar</Text>
						</View>
					</View>
					{totalProducts && (
						<View
							direction='row'
							justifyContent='between'
							gap={12}>
							<Text fontSize='extra-small'>
								{`Exibindo ${
									totalProducts > 1 ? `${totalProducts} produtos` : `${totalProducts} produto`
								}`}
							</Text>
						</View>
					)}
					<InfiniteScroll onScrollEnd={onScrollEnd}>
						<SearchResults
							isLoading={isProductLoading}
							searchResults={searchResults}
							trackingListId={`search_${slugify(params?.query)}`}
							trackingListName={`busca ${params?.query}`}
						/>
					</InfiniteScroll>
				</View>
			)}

			{/* {!isProductLoading && searchResults.length === 0 && (
				<>
					<TopSearches
						marginTop='large'
						onSubmit={handleSearchSubmit}
					/>

					<SearchHistory
						marginTop='large'
						onSubmit={handleSearchSubmit}
					/>
				</>
			)} */}

			<FacetsModal
				show={showModal}
				initialFilters={params}
				onApplyFilters={_onApplyFilters}
				onRemoveFilters={_onRemoveFilters}
				modalReady={setFacetsModalReady}
				onClose={() => setShowModal(false)}
				mode={modeModal}
			/>
		</Page>
	)
}
