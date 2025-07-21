import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderCart, HeaderReturn, HeaderWishList } from 'shopping-vtex-template-shared'
import { autocompleteSuggestions, getProductsService } from '../services/ProductService'
import SearchInput from '../components/SearchInput/SearchInput'
import SearchResults from '../components/PageSearchComponents/SearchResults'
import { useLocalShoppingCart } from '../providers/LocalCart'
import InfiniteScroll from '../components/InfiniteScroll/InfiniteScroll'
import HeaderFilter from '../components/HeaderFilter/HeaderFilter'
import { View } from 'eitri-luminus'
import ProductCatalogContent from '../components/ProductCatalogContent/ProductCatalogContent'

export default function Search(props) {
	const incomingSearchTerm = props?.history?.location?.state?.searchTerm || props?.location?.state?.searchTerm

	const { startCart } = useLocalShoppingCart()

	const [params, setParams] = useState(null)
	const [pristine, setPristine] = useState(true)

	useEffect(() => {
		window.scroll(0, 0)

		if (incomingSearchTerm) {
			setParams(incomingSearchTerm)
		}

		Eitri.eventBus.subscribe({
			channel: 'onUserTappedActiveTab',
			callback: _ => {
				Eitri.navigation.backToTop()
			}
		})

		Eitri.navigation.setOnResumeListener(() => {
			startCart()
		})

		// Tracking.screenView('busca', 'Search')
	}, [])

	const handleSearchSubmit = async term => {
		if (term) {
			Eitri.keyboard.dismiss()
			try {
				const params = {
					sort: 'release:desc',
					facets: [],
					query: term
				}
				//saveSearchHistory(term)
				setParams(params)
			} catch (error) {
				console.log('handleSearchSubmit', error)
			}
		}
	}

	return (
		<Page title='Tela de busca'>
			<HeaderContentWrapper
				scrollEffect={false}
				className='gap-3 w-full justify-between relative'>
				<HeaderReturn />

				<SearchInput
					incomingValue={params?.query}
					onSubmit={handleSearchSubmit}
				/>

				<HeaderWishList
					onPress={() => {}}
					padding='none'
				/>
			</HeaderContentWrapper>

			<View bottomInset>{params && <ProductCatalogContent params={params} />}</View>

			{/*
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
			)} */}

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
		</Page>
	)
}
