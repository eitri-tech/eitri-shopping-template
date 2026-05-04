import { useTranslation } from 'eitri-i18n'
import iconClock from '../../assets/icons/clock.svg'
import iconLinkGrey from '../../assets/icons/link_grey.svg'
import { getSearchHistory } from '../../services/CatalogService'

export default function SearchHistory(props) {
	const { onSubmit, ...rest } = props
	const { t } = useTranslation()

	const [history, setHistory] = useState([])

	useEffect(() => {
		getSearchHistory()
			.then(res => setHistory(res))
			.catch(err => {})
	}, [])

	if (!history?.length) return null

	return (
		<View
			backgroundColor='accent-100'
			padding='large'
			{...rest}>
			<Text
				fontWeight='bold'
				fontSize='small'>
				{t('searchHistory.title', 'Buscas recentes')}
			</Text>

			<View
				marginTop='large'
				direction='column'
				gap={8}>
				{history.map((term, index) => (
					<View
						key={term ? `${term}-${index}` : index}
						display='flex'
						justifyContent='between'
						alignItems='center'
						onClick={() => onSubmit(term)}>
						<View
							display='flex'
							alignItems='center'
							height='24px'
							gap={8}>
							<Image
								src={iconClock}
								width={20}
							/>

							<Text fontSize='extra-small'>{term}</Text>
						</View>

						<Image
							src={iconLinkGrey}
							width={12}
						/>
					</View>
				))}
			</View>
		</View>
	)
}
