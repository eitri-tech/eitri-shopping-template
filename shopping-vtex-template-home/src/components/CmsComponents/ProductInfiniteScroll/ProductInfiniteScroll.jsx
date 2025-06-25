import { getProductsByFacets } from '../../../services/ProductService'
import SearchResults from '../../PageSearchComponents/SearchResults'

export default function ProductInfiniteScroll(props) {
	const { data } = props

	const [scrollEnded, setScrollEnded] = useState(false)
	const [productLoading, setProductLoading] = useState(false)
	const [products, setProducts] = useState([])
	const [currentPage, setCurrentPage] = useState(1)
	const [pagesHasEnded, setPageHasEnded] = useState(false)

	useEffect(() => {
		_getProductsByFacets(data, currentPage)
	}, [])

	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
				setScrollEnded(true)
			}
		}
		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		if (!productLoading && scrollEnded && !pagesHasEnded) {
			const newPage = currentPage + 1
			setCurrentPage(newPage)
			_getProductsByFacets(data, newPage)
		}
		setScrollEnded(false)
	}, [scrollEnded])

	const _getProductsByFacets = async (selectedFacets, page) => {
		try {
			if (productLoading || pagesHasEnded) return
			console.log('selectedFacets', selectedFacets)
			setProductLoading(true)

			const facetsPath = selectedFacets?.facets?.map(facet => `${facet.key}/${facet.value}`).join('/')
			console.log('facetsPath', facetsPath)
			const result = await getProductsByFacets(facetsPath, {
				sort: selectedFacets.sort,
				query: selectedFacets?.query || selectedFacets?.q || '',
				page: page
			})

			if (result.products.length === 0) {
				setProductLoading(false)
				setPageHasEnded(true)
				return
			}
			setProducts(prev => [...prev, ...result.products])
			setProductLoading(false)
		} catch (error) {
			console.log('Error getProductsByFacets:', error)
		}
	}

	return (
		<View className='px-6'>
			{data?.title && (
				<View className='flex justify-between items-center'>
					<Text className='font-bold text-xl'>{data?.title}</Text>
				</View>
			)}
			<SearchResults
				searchResults={products}
				isLoading={productLoading}
			/>
		</View>
	)
}
