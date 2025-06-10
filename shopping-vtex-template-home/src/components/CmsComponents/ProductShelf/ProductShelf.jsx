import { getProductsByFacets } from '../../../services/ProductService'
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
		setIsLoadingProducts(true)
		let query = {}
		if (data.term) {
			query = { q: data.term }
		}
		const processedFacets = processFacets(data)
		const processedSort = processSort(data)
		const processedPagination = processPagination(data)

		const _searchOptions = {
			...processedSort,
			...processedPagination,
			...query
		}
		const result = await getProductsByFacets(processedFacets, _searchOptions)
		setCurrentProducts(result.products)
		setSearchParams({ facets: data?.selectedFacets, ..._searchOptions })
		setIsLoadingProducts(false)
	}

	const processFacets = shelf => {
		if (!shelf?.selectedFacets) return ''

		return shelf?.selectedFacets?.reduce((acc, facet) => {
			acc += `/${facet.key}/${facet.value}`
			return acc
		}, '')
	}

	const processSort = shelf => {
		if (!shelf?.sort || shelf?.sort === 'score_desc') return {}
		return { sort: shelf?.sort?.replace('_', ':') }
	}

	const processPagination = shelf => {
		const { numberOfItems } = shelf
		return { count: numberOfItems || 8 }
	}

	return (
		<ShelfOfProducts
			mode='carousel'
			title={data?.title}
			isLoading={isLoadingProducts}
			products={currentProducts}
			searchParams={searchParams}
		/>
	)
}
