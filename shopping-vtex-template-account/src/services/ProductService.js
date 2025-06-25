import { Vtex } from 'eitri-shopping-vtex-shared'

export const getProductById = async productId => {
	return Vtex.catalog.getProductById(productId)
}
