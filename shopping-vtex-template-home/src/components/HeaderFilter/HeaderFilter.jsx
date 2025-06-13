import Eitri from 'eitri-bifrost'
import { useState } from 'react'
import { View } from 'eitri-luminus'
import FacetsModal from '../FacetsModal/FacetsModal'

export default function HeaderFilter(props) {
	const { initialParams, currentParams, onApplyFilters, onClearFilters } = props

	const [facetsModalReady, setFacetsModalReady] = useState(false)
	const [showModal, setShowModal] = useState(false)

	const handleFilterModal = () => {
		setShowModal(true)
	}

	const _onApplyFilters = filters => {
		onApplyFilters(filters)
		setShowModal(false)
	}

	const _onRemoveFilters = () => {
		onClearFilters()
		setShowModal(false)
	}

	const hasAppliedFilters = () => {
		return JSON.stringify(currentParams) !== JSON.stringify(initialParams)
	}

	return (
		<>
			<View
				onClick={handleFilterModal}
				className={`relative ${facetsModalReady ? 'opacity-100' : 'opacity-50'}`}>
				<View>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						height='24px'
						viewBox='0 -960 960 960'
						width='24px'
						fill='#e3e3e3'>
						<path d='M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z' />
					</svg>
				</View>

				{hasAppliedFilters() && (
					<View className='absolute bg-primary-700 w-3 h-3 -right-1 -top-0.5 rounded-full' />
				)}
			</View>

			<FacetsModal
				show={showModal}
				initialFilters={currentParams}
				modalReady={() => setFacetsModalReady(true)}
				onClose={() => setShowModal(false)}
				onApplyFilters={_onApplyFilters}
				onRemoveFilters={_onRemoveFilters}
			/>
		</>
	)
}
