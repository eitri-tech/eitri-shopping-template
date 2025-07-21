import { useEffect } from 'react'
import { View } from 'eitri-luminus'
import { getProductsService } from '../../services/ProductService'
import { useState } from 'react'
import { Loading } from 'shopping-vtex-template-shared'
import SearchResults from '../../components/PageSearchComponents/SearchResults'
import CatalogSort from './Components/CatalogSort'
import { getDefaultSortParam } from '../../services/helpers/resolveSortParam'
import CatalogFilter from './Components/CatalogFilter'

export default function ProductCatalogContent(props) {
	/*
	 * props:
	 *
	 * params: {
	 *  facets: Array<{ key: string, value: string }>
	 *  query: string
	 *  sort: string
	 * }
	 * */

	const { params, ...rest } = props

	const [initialLoading, setInitialLoading] = useState(true)
	const [productLoading, setProductLoading] = useState(false)
	const [windowFilter, setWindowFilter] = useState(false)
	const [products, setProducts] = useState([])
	const [initialFilters, setInitialFilters] = useState(null)
	const [hasFilters, setHasFilters] = useState(false)
	const [appliedFacets, setAppliedFacets] = useState([]) // Filtros efetivamente usados na busca
	const [currentPage, setCurrentPage] = useState(1)
	const [pagesHasEnded, setPageHasEnded] = useState(false)

	useEffect(() => {
		if (params) {
			params.sort = params.sort || getDefaultSortParam()

			setInitialFilters(params)
			setAppliedFacets(params)
			setProducts([])
			getProducts(params, currentPage)
		}
	}, [params])

	const getProducts = async (selectedFacets, page) => {
		try {
			if (productLoading || pagesHasEnded) return

			setProductLoading(true)

			const result = await getProductsService(selectedFacets, page)

			if (result?.products?.length === 0) {
				setProductLoading(false)
				setPageHasEnded(true)
				return
			}

			if (result?.products?.length > 0) {
				setProducts(prev => [...prev, ...result?.products])
			}

			setCurrentPage(page)
			setProductLoading(false)
		} catch (error) {
			console.log('error', error)
		}
	}

	const onScrollEnd = async () => {
		if (!productLoading && !pagesHasEnded) {
			const newPage = currentPage + 1
			getProducts(appliedFacets, newPage)
		}
	}

	const handleSortChange = newSort => {
		const newParams = {
			...appliedFacets,
			sort: newSort
		}
		setAppliedFacets(newParams)
		setProducts([])
		setCurrentPage(1)
		setPageHasEnded(false)
		getProducts(newParams, 1)
	}

	const handleFilterChange = filters => {
		setAppliedFacets(filters)
		setProducts([])
		setCurrentPage(1)
		setPageHasEnded(false)
		getProducts(filters, 1)
	}

	return (
		<>
			<View
				padding={'small'}
				direction='column'
				gap={12}>
				<View className='p-4 flex flex-between gap-4 w-full'>
					<CatalogFilter
						currentFilters={appliedFacets}
						onFilterChange={handleFilterChange}
					/>
					<CatalogSort
						currentSort={appliedFacets?.sort}
						onSortChange={handleSortChange}
					/>
				</View>

				{/* <View
						direction='row'
						justifyContent='between'
						gap={12}>
						<View
							onPress={() => handleFilterModal('filter')}
							paddingVertical='extra-small'
							backgroundColor='accent-100'
							width='100%'
							borderWidth='hairline'
							borderColor='neutral-300'
							direction='row'
							justifyContent='center'
							alignItems='center'
							borderRadius='micro'>
							<Text>Filtrar</Text>
						</View>
						<View
							onPress={() => handleFilterModal('order')}
							paddingVertical='extra-small'
							backgroundColor='accent-100'
							width='100%'
							borderWidth='hairline'
							borderColor='neutral-300'
							direction='row'
							justifyContent='center'
							alignItems='center'
							borderRadius='micro'>
							<Text>Ordenar</Text>
						</View>
					</View> */}
				{/* {totalProducts && (
					<View
						direction='row'
						justifyContent='between'
						gap={12}>
						<Text fontSize='extra-small'>
							{`Exibindo ${totalProducts > 1 ? `${totalProducts} produtos` : `${totalProducts} produto`}`}
						</Text>
					</View>
				)} */}
				<InfiniteScroll onScrollEnd={onScrollEnd}>
					<SearchResults
						isLoading={productLoading}
						searchResults={products}
					/>
				</InfiniteScroll>
			</View>
		</>
	)
}
