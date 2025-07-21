import { HeaderContentWrapper, HeaderReturn, HeaderText, HeaderSearchIcon } from 'shopping-vtex-template-shared'

import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import ProductCatalogContent from '../components/ProductCatalogContent/ProductCatalogContent'

export default function ProductCatalog(props) {
	const { location } = props

	const title = location.state.title
	const openInBottomBar = !!location.state.openInBottomBar

	const { t } = useTranslation()

	const [appliedFacets, setAppliedFacets] = useState(null) // Filtros efetivamente usados na busca

	useEffect(() => {
		const params =
			location.state.params ??
			(location.state.facets ? parseLegacyPropsParams(location.state.facets) : { facets: [] })

		setAppliedFacets(params)

		if (!openInBottomBar) {
			Eitri.eventBus.subscribe({
				channel: 'onUserTappedActiveTab',
				callback: _ => {
					Eitri.navigation.back()
				}
			})
		}
	}, [])

	const goToSearch = () => {
		Eitri.navigation.navigate({ path: 'Search' })
	}

	const parseLegacyPropsParams = input => {
		if (!input) return {}

		const segments = input.split('/')
		const result = []

		for (let i = 0; i < segments.length; i += 2) {
			const key = segments[i]
			const value = segments[i + 1]
			result.push({ key: key, value: value })
		}

		return { facets: result }
	}

	return (
		<Page title={title || t('productCatalog.title')}>
			<>
				<HeaderContentWrapper className={`justify-between`}>
					<View className={`flex items-center gap-4`}>
						{!openInBottomBar && <HeaderReturn />}

						<HeaderText text={title || t('productCatalog.title')} />
					</View>

					<HeaderSearchIcon onPress={goToSearch} />
				</HeaderContentWrapper>

				{appliedFacets && (
					<ProductCatalogContent
						bottomInset={'auto'}
						params={appliedFacets}
					/>
				)}
			</>
		</Page>
	)
}
