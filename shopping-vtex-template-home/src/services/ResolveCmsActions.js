import { openBrand, resolveNavigation } from './NavigationService'
import Eitri from 'eitri-bifrost'

const handleLegacySearchAction = (value, title) => {
	Eitri.navigation.navigate({
		path: 'ProductCatalog',
		state: {
			facets: value,
			title: title
		}
	})
}
const handleSearchAction = value => {
	Eitri.navigation.navigate({
		path: 'Search',
		state: {
			searchTerm: value
		}
	})
}
const handleCollectionAction = (value, title, banner) => {
	Eitri.navigation.navigate({
		path: 'ProductCatalog',
		state: {
			facets: [{ key: 'productClusterIds', value: value }],
			title,
			banner
		}
	})
}
const handlePageAction = value => {
	Eitri.navigation.navigate({
		path: 'LandingPage',
		state: {
			landingPageName: value
		}
	})
}
const handleCategoryAction = (value, title, banner) => {
	const _categories = value.split('/')
	const categories = _categories.filter(c => !!c)

	const params = {
		facets: categories.map((c, index) => {
			return {
				key: `category-${index + 1}`,
				value: c
			}
		})
	}

	Eitri.navigation.navigate({ path: 'ProductCatalog', state: { params, title, banner } })
}
const handleProductAction = value => {
	openProductById(value)
}

export const processActions = sliderData => {
	const action = sliderData?.action
	switch (action?.type) {
		case 'legacySearch':
			handleLegacySearchAction(action.value, action.title || sliderData.title)
			break
		case 'search':
			handleSearchAction(action.value)
			break
		case 'collection':
			handleCollectionAction(action.value, action.title || sliderData.title)
			break
		case 'page':
			handlePageAction(action.value)
			break
		case 'category':
			handleCategoryAction(action.value, action.title || sliderData.title, action.banner)
			break
		case 'product':
			handleProductAction(action.value)
			break
		case 'path':
			resolveNavigation(action.value)
			break
		case 'brand':
			openBrand(action.value, action.title)
			break
		default:
			console.log(`Unknown action type: ${action.type}`)
	}
}
