import ProductCatalogContent from '../../ProductCatalogContent/ProductCatalogContent'

export default function ProductInfiniteScroll(props) {
	const { data } = props

	const [params, setParams] = useState(null)

	useEffect(() => {
		const params = {
			facets: data.facets || [],
			query: data.term ?? '',
			sort: data.sort ?? ''
		}
		setParams(data)
	}, [])

	return (
		<View>
			{data?.title && (
				<View className='flex justify-between items-center'>
					<Text className='font-bold text-xl'>{data?.title}</Text>
				</View>
			)}
			<ProductCatalogContent
				params={params}
				hideFilters
			/>
		</View>
	)
}
