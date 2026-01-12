import { openProductById, openProductBySlug, resolveNavigation } from './NavigationService'
import Eitri from 'eitri-bifrost'

const handleSearchAction = value => {
	Eitri.navigation.navigate({
		path: 'Search',
		state: {
			searchTerm: value
		}
	})
}
const handleCollectionAction = action => {
	Eitri.navigation.navigate({
		path: 'ProductCatalog',
		state: {
			params: {
				facets: [{ key: 'productClusterIds', value: action?.value }],
				sort: action?.sort || ''
			},
			title: action?.title || '',
			banner: action?.banner || ''
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
const handleCategoryAction = action => {
	const _categories = action?.value?.split('/')
	const categories = _categories?.filter(c => !!c)

	const params = {
		facets: categories?.map((c, index) => {
			return {
				key: `category-${index + 1}`,
				value: c
			}
		}),
		sort: action?.sort || ''
	}
	Eitri.navigation.navigate({
		path: 'ProductCatalog',
		state: { params, title: action?.title, banner: action?.banner }
	})
}
const handleProductAction = value => {
	if (/^\d+$/.test(value)) {
		openProductById(value)
	} else {
		openProductBySlug(value)
	}
}
const openBrand = action => {
	const facets = [{ key: 'brand', value: action?.value }]
	Eitri.navigation.navigate({
		path: 'ProductCatalog',
		state: { params: { facets, sort: action?.sort }, title: action?.title || '' }
	})
}
const openLink = link => {
	Eitri.openBrowser({
		url: link,
		inApp: true
	})
}

export const processActions = sliderData => {
	const action = sliderData?.action
	switch (action?.type) {
		case 'search':
			handleSearchAction(action.value)
			break
		case 'collection':
			handleCollectionAction(action)
			break
		case 'page':
			handlePageAction(action.value)
			break
		case 'category':
			handleCategoryAction(action)
			break
		case 'product':
			handleProductAction(action.value)
			break
		case 'path':
			resolveNavigation(action.value)
			break
		case 'brand':
			openBrand(action)
			break
		case 'link':
			openLink(action.value)
			break
		default:
			console.log(`Unknown action type: ${action.type}`)
	}
}
