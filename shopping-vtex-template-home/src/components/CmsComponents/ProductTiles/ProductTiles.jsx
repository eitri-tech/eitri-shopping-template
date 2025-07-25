import { getProductsService } from '../../../services/ProductService'
import { Text, View } from 'eitri-luminus'
import ShelfOfProducts from '../../ShelfOfProducts/ShelfOfProducts'

export default function ProductTiles(props) {
	const { data } = props
	const [shelves, setShelves] = useState([])
	const [currentShelf, setCurrentShelf] = useState({})
	const [currentProducts, setCurrentProducts] = useState([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [cachedProducts, setCachedProducts] = useState({})

	useEffect(() => {
		if (data?.shelfs) {
			setShelves(data.shelfs)
			setCurrentShelf(data.shelfs[0])
		}
	}, [data])

	useEffect(() => {
		executeProductSearch(currentShelf)
	}, [currentShelf])

	const executeProductSearch = async shelf => {
		if (cachedProducts[shelf.title]) {
			setCurrentProducts(cachedProducts[shelf.title])
			return
		}

		setIsLoadingProducts(true)

		const params = {
			facets: data.facets || [],
			query: data.term ?? '',
			sort: data.sort ?? '',
			count: data.numberOfItems || 8
		}

		const result = await getProductsService(params)
		setCurrentProducts(result.products)
		setIsLoadingProducts(false)
	}

	const onChooseShelf = shelf => {
		setCurrentShelf(structuredClone(shelf))
	}

	return (
		<View>
			{data?.title && (
				<View className='px-4 py-2'>
					<Text className='font-bold'>{data?.title}</Text>
				</View>
			)}
			<View className='overflow-x-auto flex px-4 gap-2'>
				{shelves?.map(shelf => (
					<View
						key={shelf.title}
						onClick={() => onChooseShelf(shelf)}
						className={`py-1 px-3 border min-w-fit rounded-full ${
							shelf.title === currentShelf.title ? 'border-primary' : 'border-neutral-400'
						}`}>
						<Text className={`${shelf.title === currentShelf.title ? 'text-primary' : 'text-neutral-400'}`}>
							{shelf.title}
						</Text>
					</View>
				))}
			</View>
			<ShelfOfProducts
				mode='carousel'
				isLoading={isLoadingProducts}
				products={currentProducts}
			/>
		</View>
	)
}
