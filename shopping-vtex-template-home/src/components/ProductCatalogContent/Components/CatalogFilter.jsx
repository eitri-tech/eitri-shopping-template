import { useEffect, useState } from 'react'
import { View, Text, Button, Modal } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'
import { getProductsFacetsService } from '../../../services/ProductService'
import { CustomButton } from 'shopping-vtex-template-shared'
import CustomModal from '../../CustomModal/CustomModal'

export default function CatalogFilter(props) {
	const { currentFilters, onFilterChange, onFilterClear } = props

	const [showModal, setShowModal] = useState(false)
	const [tempFilters, setTempFilters] = useState(currentFilters)
	const [filterFacets, setFilterFacets] = useState([])
	const [facetsLoading, setFacetsLoading] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		if (tempFilters) {
			loadFacetsOptions(tempFilters)
		}
	}, [tempFilters])

	useEffect(() => {
		setTempFilters(currentFilters)
	}, [currentFilters])

	const loadFacetsOptions = async selectedFacets => {
		setFacetsLoading(true)
		const result = await getProductsFacetsService(selectedFacets)
		console.log('result', result)
		setFilterFacets(result)
		setFacetsLoading(false)
	}

	const handleFilterToggle = (filterValue, e) => {
		e.stopPropagation()
		const existingIndex = tempFilters?.facets?.findIndex(f => f.key === filterValue.key)
		let newFacets
		if (existingIndex !== -1 && existingIndex !== undefined) {
			newFacets = tempFilters.facets.filter(f => f.key !== filterValue.key)
		} else {
			newFacets = [...(tempFilters?.facets || []), { key: filterValue.key, value: filterValue.value }]
		}
		setTempFilters({
			...tempFilters,
			facets: newFacets
		})
	}

	const onApplyFilters = () => {
		onFilterChange(tempFilters)
		setShowModal(false)
	}

	return (
		<>
			<CustomButton
				disabled={facetsLoading}
				onClick={() => setShowModal(true)}
				leftIcon={
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'>
						<path d='M22 3H2l8 9.46V19l4 2v-8.54L22 3z' />
					</svg>
				}
				label={t('categoryPageModal.title')}
			/>

			{showModal && (
				<CustomModal
					open={showModal}
					onClose={() => setShowModal(false)}>
					<View
						bottomInset={'auto'}
						className='bg-white rounded-t w-full max-h-[70vh] overflow-y-auto pointer-events-auto p-4'>
						<View className='flex flex-row items-center justify-between border-b border-gray-300 pb-1'>
							<Text className='text-lg font-semibold'>{t('categoryPageModal.title')}</Text>
						</View>

						<View className='flex flex-col gap-4 mt-4'>
							{filterFacets.map(facet => (
								<View key={facet.key}>
									<Text className='text-base font-medium text-gray-800'>{facet.name}</Text>
									<View className='flex flex-wrap gap-2 mt-4'>
										{facet.values.map((value, index) => (
											<View
												key={`${facet.key}-${index}`}
												onClick={e => handleFilterToggle(value, e)}
												className={`px-4 py-2 rounded-full transition-all duration-200 border-2 ${
													value.selected
														? 'bg-primary border-primary text-primary-content'
														: 'bg-white border-gray-300 text-gray-700'
												}`}>
												<Text
													className={`text-sm font-medium ${
														value.selected ? 'text-primary-content' : 'text-gray-700'
													}`}>
													{value.name}
													{value.count && (
														<Text
															className={`ml-1 ${
																value.selected
																	? 'text-primary-content/80'
																	: 'text-gray-500'
															}`}>
															({value.count})
														</Text>
													)}
												</Text>
											</View>
										))}
									</View>
								</View>
							))}
						</View>

						<View className='mt-6 flex flex-row justify-between py-4 w-full border-t border-gray-200 gap-4'>
							<CustomButton
								outlined
								onClick={onFilterClear}
								label={t('categoryPageModal.clear')}
							/>
							<CustomButton
								onClick={onApplyFilters}
								label={t('categoryPageModal.button')}
							/>
						</View>
					</View>
				</CustomModal>
			)}
		</>
	)
}
