import { useState, useEffect } from 'react'
import { View, Page } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, HeaderText, HeaderSearchIcon } from 'shopping-vtex-template-shared'

import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import ProductCatalogContent from '../components/ProductCatalogContent/ProductCatalogContent'

export default function ProductCatalog(props) {
	const { location } = props
	const { t } = useTranslation()

	const title = location.state.title
	const openInBottomBar = !!location.state.openInBottomBar

	const [appliedFacets, setAppliedFacets] = useState(null)

	useEffect(() => {
		const params = location.state.params
		console.log('ProductCatalog: Parâmetros recebidos:', params)
		console.log('ProductCatalog: State completo:', location.state)
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

	return (
		<Page title={title || t('productCatalog.title')}>
			<>
				<HeaderContentWrapper className={`justify-between`}>
					<View className={`flex items-center gap-4`}>
						{!openInBottomBar && <HeaderReturn />}

						<HeaderText text={title || t('productCatalog.title')} />
					</View>

					<HeaderSearchIcon onClick={goToSearch} />
				</HeaderContentWrapper>

				{appliedFacets && (
					<ProductCatalogContent
						banner={location?.state?.banner}
						params={appliedFacets}
					/>
				)}
			</>
		</Page>
	)
}
