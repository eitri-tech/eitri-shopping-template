import { useEffect, useState } from 'react'
import { View, Text, Button, Modal } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'
import { getProductsFacetsService } from '../../../services/ProductService'
import { CustomButton } from 'shopping-vtex-template-shared'

export default function CatalogFilter(props) {
	const { currentFilters, onFilterChange } = props

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
		setFilterFacets(result)
		setFacetsLoading(false)
	}

	const handleFilterToggle = filterValue => {
		const key = filterValue.key

		const existingIndex = tempFilters?.facets?.findIndex(f => f.key === filterValue.key)
		let newFacets
		if (existingIndex !== -1 && existingIndex !== undefined) {
			// Remove if exists
			newFacets = tempFilters.facets.filter(f => f.key !== filterValue.key)
		} else {
			// Add if not exists
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
			<Button
				onClick={() => setShowModal(true)}
				className='flex-grow btn-outline btn-sm gap-2 bg-white border-gray-300 hover:bg-gray-50 text-gray-700'>
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
				<Text className='text-sm font-medium'>{t('categoryPageModal.title')}</Text>
			</Button>

			{showModal && (
				<Modal
					className='z-[9999] !bg-black/70 !opacity-100 modal modal-bottom'
					onClose={() => setShowModal(false)}>
					<View
						bottomInset={'auto'}
						className='bg-white rounded-t w-full max-h-[70vh] overflow-y-auto pointer-events-auto'>
						<View className='flex flex-row items-center justify-between p-4 border-b border-gray-200'>
							<Text className='text-lg font-semibold'>{t('categoryPageModal.title')}</Text>
							<Button
								onClick={() => setShowModal(false)}
								className='btn btn-ghost btn-sm'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'>
									<line
										x1='18'
										y1='6'
										x2='6'
										y2='18'
									/>
									<line
										x1='6'
										y1='6'
										x2='18'
										y2='18'
									/>
								</svg>
							</Button>
						</View>

						<View className='flex flex-col'>
							{filterFacets.map(facet => (
								<View
									key={facet.key}
									className='border-b border-gray-100'>
									<Text className='text-base font-medium p-4 text-gray-800'>{facet.name}</Text>
									<View className='flex flex-wrap gap-2 p-4'>
										{facet.values.map((value, index) => (
											<View
												key={`${facet.key}-${index}`}
												onClick={() => handleFilterToggle(value)}
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

						<View className='mt-6 flex flex-row justify-between p-4 w-full border-t border-gray-200'>
							<CustomButton
								outlined
								onClick={() => {
									// Clear all filters logic would go here
									setShowModal(false)
								}}
								label={t('categoryPageModal.clear')}
							/>
							<CustomButton
								onClick={onApplyFilters}
								label={t('categoryPageModal.button')}
							/>
						</View>
					</View>
				</Modal>
			)}
		</>
	)
}
