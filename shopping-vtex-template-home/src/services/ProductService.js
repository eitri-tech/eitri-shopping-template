import { Vtex } from 'eitri-shopping-vtex-shared'
import { CMS_PRODUCT_SORT } from '../utils/Constants'
import { resolveSortParam } from './helpers/resolveSortParam'

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
	if (params?.count) {
		options.count = params.count
	}
	return await Vtex.catalog.getProductsByFacets(facetsPath, options)
}

export const getProductsFacetsService = async params => {
	const facetsPath = params?.facets?.map(facet => `${facet.key}/${facet.value}`).join('/')
	const options = {
		query: params?.query || params?.q || ''
	}

	const result = await Vtex.catalog.getPossibleFacets(facetsPath, options)

	return formatPriceRangeFacet(result)
}

const formatPriceRangeFacet = facetQueryResult => {
	return facetQueryResult.facets
		.filter(facet => !facet.hidden)
		.map(facet => {
			if (facet.type === 'PRICERANGE') {
				return {
					...facet,
					values: facet.values.map(value => {
						return {
							...value,
							name: `De ${value?.range?.from?.toLocaleString('pt-br', {
								style: 'currency',
								currency: 'BRL'
							})} à ${value.range.to.toLocaleString('pt-br', {
								style: 'currency',
								currency: 'BRL'
							})}`,
							value: `${value.range.from}:${value.range.to}`
						}
					})
				}
			} else {
				return facet
			}
		})
}

export const getProductById = async productId => {
	return await Vtex.catalog.getProductById(productId)
}
