import { getTopSearches } from '../../services/CatalogService'
import { useTranslation } from 'eitri-i18n'

export default function TopSearches(props) {
	const { onSubmit, ...rest } = props
	const { t } = useTranslation()

	const [searches, setSearches] = useState([])

	useEffect(() => {
		getTopSearches()
			.then(res => {
				const searches = res?.searches
				setSearches(searches)
			})
			.catch(err => {})
	}, [])

	return (
		<View
			backgroundColor='accent-100'
			padding='large'
			{...rest}>
			<Text
				fontWeight='bold'
				fontSize='small'>
				{t('topSearches.title', 'Mais buscados')}
			</Text>
			<View
				display='flex'
				flexWrap='wrap'
				gap={8}
				marginTop='small'>
				{searches?.map(search => (
					<View
						key={search?.term}
						borderRadius='pill'
						borderWidth='hairline'
						width='fit-content'
						padding='nano'
						paddingHorizontal='small'
						onClick={() => onSubmit(search?.term)}>
						<Text fontWeight='bold'>{search?.term}</Text>
					</View>
				))}
			</View>
		</View>
	)
}
