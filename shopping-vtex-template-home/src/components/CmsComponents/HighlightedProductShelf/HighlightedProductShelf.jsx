import { getProductsService } from '../../../services/ProductService'

export default function HighlightedProductShelf(props) {
	const { data } = props

	console.log('data====>', data)

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
		if (result) {
			setCurrentProducts(result.products)
			setSearchParams({ facets: data?.facets, ...params })
		}
		setIsLoadingProducts(false)
	}

	return <View></View>
}
