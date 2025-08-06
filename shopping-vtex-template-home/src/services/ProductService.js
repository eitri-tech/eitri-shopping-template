import { Vtex } from 'eitri-shopping-vtex-shared'
import { CMS_PRODUCT_SORT } from '../utils/Constants'
import { resolveSortParam } from './helpers/resolveSortParam'

export const autocompleteSuggestions = async value => {
	return await Vtex.catalog.autoCompleteSuggestions(value)
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
	const PAGE_SIZE = 12

	let from = 1
	let to = PAGE_SIZE

	if (page) {
		from = (page - 1) * PAGE_SIZE + 1
		to = page * PAGE_SIZE
	}

	const options = {
		fullText: params?.query || params?.q || '',
		selectedFacets: params?.facets,
		orderBy: resolveSortParam(params.sort, true),
		from: params?.from || from,
		to: params?.to || to,
		hideUnavailableItems: true
	}

	return await Vtex.searchGraphql.productSearch(options)
}

export const getProductsServiceRest = async (params, page) => {
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
	const options = {
		fullText: params?.query || params?.q || '',
		selectedFacets: params?.facets,
		hideUnavailableItems: true
	}

	return await Vtex.searchGraphql.facets(options)
}

export const getProductsFacetsServiceRest = async params => {
	const facetsPath = params?.facets?.map(facet => `${facet.key}/${facet.value}`).join('/')
	const options = {
		query: params?.query || params?.q || ''
	}

	const result = await Vtex.catalog.getPossibleFacets(facetsPath, options)

	return formatPriceRangeFacet(result)
}

const formatPriceRangeFacet = facetQueryResult => {
	return facetQueryResult.facets.map(facet => {
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
	return await Vtex.searchGraphql.product({
		identifier: { field: 'id', value: productId }
	})
}
