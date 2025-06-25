import { Vtex } from 'eitri-shopping-vtex-shared'
import Eitri from 'eitri-bifrost'

export const getProductById = async productId => {
	return Vtex.catalog.getProductById(productId)
}

export const getSimilarProducts = async productId => {
	return Vtex.catalog.getSimilarProducts(productId)
}

export const getSearchProducts = async productId => {
	return Vtex.catalog.getSearchProducts(productId)
}

export const getWhoSawAlsoSaw = async productId => {
	return Vtex.catalog.getWhoSawAlsoSaw(productId)
}

export const markLastViewedProduct = async product => {
	const key = `last-seen-products`

	const productHistory = await Eitri.sharedStorage.getItemJson(key)

	if (productHistory) {
		const prevContentIndex = productHistory.findIndex(content => content.productId === product.productId)
		if (prevContentIndex === 0) {
			return
		}
		if (prevContentIndex !== -1) {
			productHistory.splice(prevContentIndex, 1)
			productHistory.unshift({ productId: product.productId, date: new Date().toISOString() })
		} else {
			productHistory.unshift({ productId: product.productId, date: new Date().toISOString() })
		}
		await Eitri.sharedStorage.setItemJson(key, productHistory.slice(0, 14))
	} else {
		await Eitri.sharedStorage.setItemJson(key, [{ productId: product.productId, date: new Date().toISOString() }])
	}
}

export const findSpecificationValue = (product, specificationName) => {
	if (product[specificationName]) {
		return product[specificationName]
	}

	const specification = product?.specificationGroups?.reduce((acc, specificationGroup) => {
		if (acc) return acc
		return specificationGroup?.specifications?.find(spec => spec.name === specificationName)
	}, null)

	return specification?.values ?? ''
}
