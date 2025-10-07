import { useState, useEffect } from 'react'
import { View, Text } from 'eitri-luminus'
import ProductCatalogContent from '../../ProductCatalogContent/ProductCatalogContent'

export default function ProductInfiniteScroll(props) {
	const { data } = props

	const [params, setParams] = useState(null)

	useEffect(() => {
		if (data) {
			// Garantir que facets seja sempre um array válido
			let facets = []
			if (Array.isArray(data.facets)) {
				facets = data.facets
			} else if (data.facets && typeof data.facets === 'object') {
				// Se facets não for array mas for um objeto, tentar converter
				facets = []
			}

			// Verificar diferentes possíveis propriedades para o termo de busca
			const searchTerm = data.term || data.query || data.search || data.searchTerm || data.keyword || ''

			const searchParams = {
				facets: facets,
				query: searchTerm,
				sort: data.sort ?? ''
			}
			
			setParams(searchParams)
		}
	}, [data])

	return (
		<View>
			{data?.title && (
				<View className='flex justify-between items-center px-4'>
					<Text className='font-bold text-xl'>{data?.title}</Text>
				</View>
			)}
			{params && (
				<ProductCatalogContent
					params={params}
					hideFilters
				/>
			)}
		</View>
	)
}
