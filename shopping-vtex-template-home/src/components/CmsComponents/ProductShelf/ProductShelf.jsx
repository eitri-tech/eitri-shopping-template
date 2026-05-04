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

		try {
			const params = {
				facets: data.facets || [],
				query: data.term ?? '',
				sort: data.sort ?? '',
				to: data.numberOfItems || 8
			}

			const result = await getProductsService(params)

			if (result?.products) {
				setCurrentProducts(result.products)
				setSearchParams({ facets: data?.facets, ...params })
			}
		} catch (error) {
			console.error('Error executeProductSearch [ProductShelf] =>', error)
		} finally {
			setIsLoadingProducts(false)
		}
	}

	if (!isLoadingProducts && !currentProducts.length) return

	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))

	return (
		<ShelfOfProducts
			mode={data.mode || 'scroll'}
			title={data?.title}
			isLoading={isLoadingProducts}
			products={currentProducts}
			searchParams={searchParams}
			params={paramsObject}
		/>
	)
}
