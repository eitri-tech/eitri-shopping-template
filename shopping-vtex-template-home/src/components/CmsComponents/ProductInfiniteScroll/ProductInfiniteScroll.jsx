import ProductCatalogContent from '../../ProductCatalogContent/ProductCatalogContent'

export default function ProductInfiniteScroll(props) {
	const { data } = props

	const [params, setParams] = useState(null)

	useEffect(() => {
		setParams(data)
	}, [])

	return (
		<View>
			{data?.title && (
				<View className='flex justify-between items-center px-4'>
					<Text className='font-bold text-xl'>{data?.title}</Text>
				</View>
			)}
			<ProductCatalogContent
				params={params}
				showFilters={data.showFilters}
			/>
		</View>
	)
}
