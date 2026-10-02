import { getProductsService } from '../../../services/ProductService'
import { Text, View } from 'eitri-luminus'
import ShelfOfProducts from '../../ShelfOfProducts/ShelfOfProducts'
import SectionTitle from '../../SectionTitle/SectionTitle'

export default function ProductTiles(props) {
	const { data } = props
	const [shelves, setShelves] = useState([])
	const [currentShelf, setCurrentShelf] = useState({})
	const [cachedProducts, setCachedProducts] = useState({})

	useEffect(() => {
		if (data?.shelves) {
			setShelves(data.shelves)
			setCurrentShelf(data.shelves[0])
		}
	}, [data])

	useEffect(() => {
		if (Object.keys(currentShelf).length === 0) return
		executeProductSearch(currentShelf)
	}, [currentShelf])

	const executeProductSearch = async currentShelf => {
		try {
			if (cachedProducts[currentShelf.title]?.loaded) {
				return
			}

			setCachedProducts({
				...cachedProducts,
				[currentShelf.title]: {
					loading: true
				}
			})

			const params = {
				facets: currentShelf.facets || [],
				query: currentShelf.term ?? '',
				sort: currentShelf.sort ?? '',
				to: currentShelf.numberOfItems || 8
			}

			const result = await getProductsService(params)

			setCachedProducts({
				...cachedProducts,
				[currentShelf.title]: {
					products: result.products,
					loaded: true,
					loading: false
				}
			})

		} catch (e) {
			console.error('executeProductSearch.error', e)
		}
	}

	const onChooseShelf = shelf => {
		setCurrentShelf(JSON.parse(JSON.stringify(shelf)))
	}

	return (
		<View>
			<SectionTitle title={data?.title} />
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
			<ShelfOfProducts
				mode={data.mode || 'scroll'}
				isLoading={cachedProducts[currentShelf.title]?.loading}
				products={cachedProducts[currentShelf.title]?.products ?? []}
			/>
		</View>
	)
}
