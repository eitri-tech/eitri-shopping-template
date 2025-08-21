import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn, HeaderWishList } from 'eitri-shopping-montreal-shared'
import SearchInput from '../components/SearchInput/SearchInput'
import { useLocalShoppingCart } from '../providers/LocalCart'
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
			setPristine(false)
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
			setPristine(false)
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

			{pristine && (
				<View className='flex flex-col items-center justify-center py-12'>
					<svg
						className='mb-4 text-primary'
						width='80'
						height='80'
						viewBox='0 0 80 80'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<circle
							cx='36'
							cy='36'
							r='28'
							stroke='currentColor'
							strokeWidth='6'
							fill='#EEF2FF'
						/>
						<rect
							x='56'
							y='56'
							width='16'
							height='6'
							rx='3'
							transform='rotate(45 56 56)'
							fill='currentColor'
						/>
						<circle
							cx='36'
							cy='36'
							r='16'
							stroke='currentColor'
							strokeWidth='3'
							fill='white'
						/>
					</svg>
					<Text className='text-primary text-2xl font-bold text-center mb-2'>O que você está buscando?</Text>
					<Text className='text-base-content text-base text-center opacity-80'>
						Nos diga o que procura e achamos pra você
					</Text>
				</View>
			)}

			{params && (
				<ProductCatalogContent
					bottomInset={'auto'}
					params={params}
				/>
			)}
		</Page>
	)
}
