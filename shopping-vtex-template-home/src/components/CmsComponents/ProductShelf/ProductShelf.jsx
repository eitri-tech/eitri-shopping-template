import { useState, useEffect } from 'react'
import { getProductsService } from '../../../services/ProductService'
import ShelfOfProducts from '../../ShelfOfProducts/ShelfOfProducts'

export default function ProductShelf(props) {
	const { data } = props

	const [currentProducts, setCurrentProducts] = useState([])
	const [isLoadingProducts, setIsLoadingProducts] = useState(false)
	const [searchParams, setSearchParams] = useState()

	useEffect(() => {
		executeProductSearch()
	}, [])

	const executeProductSearch = async () => {
		try {
			setIsLoadingProducts(true)

			const params = {
				facets: data.facets || [],
				query: data.term ?? '',
				sort: data.sort ?? '',
				to: data.numberOfItems || 8
			}

			const result = await getProductsService(params)

			if (result && result.products && Array.isArray(result.products)) {
				setCurrentProducts(result.products)
			} else {
				setCurrentProducts([])
			}
			setSearchParams({ facets: data?.facets, ...params })
		} catch (error) {
			console.error('Erro ao buscar produtos na ProductShelf:', error)
			setCurrentProducts([])
		} finally {
			setIsLoadingProducts(false)
		}
	}

	return (
		<ShelfOfProducts
			mode={data.mode || 'scroll'}
			title={data?.title}
			isLoading={isLoadingProducts}
			products={currentProducts}
			searchParams={searchParams}
		/>
	)
}
