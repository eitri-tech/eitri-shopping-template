import { Vtex } from 'eitri-shopping-vtex-shared'

export const getProductById = async productId => {
	console.log('productId', productId)
	return await Vtex.searchGraphql.product({
		identifier: { field: 'id', value: '2023347' }
	})
}
