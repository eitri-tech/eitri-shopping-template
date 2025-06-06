import { Vtex } from 'eitri-shopping-vtex-shared'
import { CMS_PRODUCT_SORT } from '../utils/Constants'
import { resolveSortParam } from "./helpers/resolveSortParam";

export const autocompleteSuggestions = async value => {
	return await Vtex.catalog.autoCompleteSuggestions(value)
}

export const getProductsByFacets = async (facets, options) => {
	return await Vtex.catalog.getProductsByFacets(facets, options)
}

/*
* {
*  facets: Array<{ key: string, value: string }>
*  query: string
*  sort: string
*  page: number
* }
*
* */
export const getProductsService = async (params, page) => {
  const facetsPath = params?.facets?.map(facet => `${facet.key}/${facet.value}`).join('/')
  const options = {
    query: params?.query || params?.q || '',
    page: page ?? 1,
    sort: resolveSortParam(params.sort)
  }
  return await Vtex.catalog.getProductsByFacets(facetsPath, options)
}

export const getPossibleByFacets = async (facets, options) => {
	return await Vtex.catalog.getPossibleFacets(facets, options)
}

export const getProductById = async productId => {
	return await Vtex.catalog.getProductById(productId)
}

export const getProductsByLagacySearch = async (path, page) => {
	const result = await Vtex.catalog.getSearchProducts(path, page)
	return result
}

export const mountLegacyPath = (facets, numberOfItems = 8, page = 1, sort) => {
	const startPosition = (page - 1) * numberOfItems
	const endPosition = startPosition + numberOfItems - 1
	const sortApi = CMS_PRODUCT_SORT[sort] || CMS_PRODUCT_SORT.score_desc

	let path = `?_from=${startPosition}&_to=${endPosition}&O=${sortApi}`

	if (Array.isArray(facets)) {
		for (const facet of facets) {
			path += `&${facet.key}=${facet.value}`
		}
	} else {
		path += `&${facets}`
	}

	return path
}
