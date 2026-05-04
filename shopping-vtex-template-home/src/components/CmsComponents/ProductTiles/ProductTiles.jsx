import { Text, View } from 'eitri-luminus'
import { getProductsService } from '../../../services/ProductService'
import ShelfOfProducts from '../../ShelfOfProducts/ShelfOfProducts'

export default function ProductTiles(props) {
	const { data } = props
	const [shelves, setShelves] = useState([])
	const [currentShelf, setCurrentShelf] = useState({})
	const [currentProducts, setCurrentProducts] = useState([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [cachedProducts, setCachedProducts] = useState({})

	useEffect(() => {
		if (data?.shelves) {
			setShelves(data.shelves)
			setCurrentShelf(data.shelves[0])
		}
	}, [data])

	useEffect(() => {
		executeProductSearch(currentShelf)
	}, [currentShelf])

	const executeProductSearch = async shelf => {
		try {
			setIsLoadingProducts(true)

			if (cachedProducts[shelf.title]) {
				setCurrentProducts(cachedProducts[shelf.title])

				return
			}

			const params = {
				facets: shelf.facets || [],
				query: shelf.term ?? '',
				sort: shelf.sort ?? '',
				to: shelf.numberOfItems || 8
			}

			const result = await getProductsService(params)

			if (result?.products) {
				setCurrentProducts(result.products)
				setCachedProducts({
					...cachedProducts,
					[shelf.title]: result.products
				})
			}
		} catch (e) {
			console.error('executeProductSearch.error', e)
		} finally {
			setIsLoadingProducts(false)
		}
	}

	const onChooseShelf = shelf => setCurrentShelf(structuredClone(shelf))

	const paramsObject = Object.fromEntries((data?.params || []).map(item => [item.key, item.value]))

	return (
		<View>
			{data?.title && (
				<View className='px-4 py-2'>
					<Text className='font-bold'>{data?.title}</Text>
				</View>
			)}

			<View className='overflow-x-auto flex px-4 gap-2 mb-1'>
				{shelves?.map(shelf => (
					<View
						key={shelf.title}
						onClick={() => onChooseShelf(shelf)}
						className={`py-1 px-3 border min-w-fit rounded ${
							shelf.title === currentShelf.title ? 'border-primary' : 'border-neutral-400'
						}`}>
						<Text className={`${shelf.title === currentShelf.title ? 'text-primary' : 'text-neutral-400'}`}>
							{shelf.title}
						</Text>
					</View>
				))}
			</View>

			{currentProducts.length > 0 ? (
				<ShelfOfProducts
					mode={data.mode || 'scroll'}
					isLoading={isLoadingProducts}
					products={currentProducts}
					params={paramsObject}
				/>
			) : (
				<View className='flex overflow-x-auto gap-2 px-4 py-2 mt-2'>
					<Skeleton className='min-w-[48vw] min-h-[370px] bg-gray-200 rounded animate-pulse' />
					<Skeleton className='min-w-[48vw] min-h-[370px] bg-gray-200 rounded animate-pulse' />
					<Skeleton className='min-w-[48vw] min-h-[370px] bg-gray-200 rounded animate-pulse' />
				</View>
			)}
		</View>
	)
}
