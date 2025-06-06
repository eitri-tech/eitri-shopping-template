import { getProductsByFacets } from '../../../services/ProductService'
import { Text, View } from "eitri-luminus";
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
  const executeProductSearch = async (shelf) => {
    if (cachedProducts[shelf.title]) {
      setCurrentProducts(cachedProducts[shelf.title])
      return
    }
    setIsLoadingProducts(true)
    const processedFacets = processFacets(shelf)
    const processedSort = processSort(shelf)
    const processedPagination = processPagination(shelf)
    const result = await getProductsByFacets(processedFacets, {
      ...processedSort,
      ...processedPagination,
    })
    setCurrentProducts(result.products)
    setCachedProducts({
      ...cachedProducts,
      [shelf.title]: result.products,
    })
    setIsLoadingProducts(false)
  }
  const processFacets = (shelf) => {
    return shelf.selectedFacets?.reduce((acc, facet) => {
      acc += `/${facet.key}/${facet.value}`
      return acc
    }, '')
  }
  const processSort = (shelf) => {
    if (!shelf?.sort) return {}
    return {
      sort: shelf?.sort?.replace('_', ':'),
    }
  }
  const processPagination = (shelf) => {
    const { numberOfItems } = shelf
    return {
      count: numberOfItems || 8,
    }
  }
  const onChooseShelf = (shelf) => {
    setCurrentShelf(structuredClone(shelf))
  }
  return (
    <View>
      {data?.title && (
        <View className="px-4 py-2">
          <Text className="font-bold">{data?.title}</Text>
        </View>
      )}
      <View className="overflow-x-auto flex px-4 gap-2">
        {shelves?.map((shelf) => (
          <View
            key={shelf.title}
            onClick={() => onChooseShelf(shelf)}
            className={`py-1 px-2 border min-w-fit rounded-full ${shelf.title === currentShelf.title ? 'border-blue-300' : 'border-neutral-300'
              }`}
          >
            <Text className={`${shelf.title === currentShelf.title ? 'text-blue-300' : 'text-neutral-300'
              }`}>
              {shelf.title}
            </Text>
          </View>
        ))}
      </View>
      <ShelfOfProducts mode="carousel" isLoading={isLoadingProducts} products={currentProducts} className="mt-8" />
    </View>
  )
}
