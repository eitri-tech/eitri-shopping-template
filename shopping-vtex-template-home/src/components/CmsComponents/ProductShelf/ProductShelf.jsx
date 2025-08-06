import { getProductsService } from '../../../services/ProductService'
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

		const params = {
			facets: data.facets || [],
			query: data.term ?? '',
			sort: data.sort ?? '',
			to: data.numberOfItems || 8
		}

		const result = await getProductsService(params)
		setCurrentProducts(result.products)
		setSearchParams({ facets: data?.facets, ...params })
		setIsLoadingProducts(false)
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
