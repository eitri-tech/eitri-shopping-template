import { useState } from 'react'
import { View, Text, Button, Modal } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'
import { LIST_ORDERING } from '../../../utils/lists'

export default function CatalogSort(props) {
	const { currentSort, onSortChange } = props

	const [showModal, setShowModal] = useState(false)

	const { t } = useTranslation()

	const handleSortSelect = sortValue => {
		onSortChange(sortValue)
		setShowModal(false)
	}

	const getCurrentSortLabel = () => {
		const currentOption = LIST_ORDERING.values.find(option => option.value === currentSort)
		return currentOption ? t(currentOption.name) : t('lists.labelRelevance')
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
					<path d='M3 6h18' />
					<path d='M7 12h10' />
					<path d='M10 18h4' />
				</svg>
				<Text className='text-sm font-medium'>{getCurrentSortLabel()}</Text>
			</Button>

			{showModal && (
				<Modal
					className='z-[9999] !bg-black/70 !opacity-100 modal modal-bottom'
					onClose={() => setShowModal(false)}>
					<View className='bg-white rounded-t w-full max-h-[70vh] overflow-y-auto pointer-events-auto'>
						<Text className='text-lg font-semibold'>{t('lists.title')}</Text>

						<View className='flex flex-col mt-4'>
							{LIST_ORDERING.values.map((option, index) => (
								<View
									key={option.value}
									onClick={() => handleSortSelect(option.value)}
									className={`flex flex-row items-center justify-between p-4 cursor-pointer transition-colors ${
										currentSort === option.value
											? 'bg-primary/10 border-l-4 border-primary'
											: 'border-l-4 border-transparent'
									}`}>
									<Text
										className={`text-base ${
											currentSort === option.value ? 'text-primary font-medium' : 'text-gray-700'
										}`}>
										{t(option.name)}
									</Text>
									{currentSort === option.value && (
										<svg
											xmlns='http://www.w3.org/2000/svg'
											width='20'
											height='20'
											viewBox='0 0 24 24'
											fill='none'
											stroke='currentColor'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											className='text-primary'>
											<polyline points='20,6 9,17 4,12' />
										</svg>
									)}
								</View>
							))}
						</View>

						<View
							bottomInset
							className='mt-6 flex justify-end'>
							<Button
								onClick={() => setShowModal(false)}
								className='btn btn-outline btn-sm'>
								<Text>Cancelar</Text>
							</Button>
						</View>
					</View>
				</Modal>
			)}
		</>
	)
}
