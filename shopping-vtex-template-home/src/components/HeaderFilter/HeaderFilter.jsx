import Eitri from 'eitri-bifrost'
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
				onPress={handleFilterModal}
				position='relative'
				opacity={facetsModalReady ? 'solid' : 'light'}>
				<View>
					{/*<Icon*/}
					{/*	color={'neutral-900'}*/}
					{/*	iconKey='filter'*/}
					{/*	width={24}*/}
					{/*	height={24}*/}
					{/*/>*/}
				</View>

				{hasAppliedFilters() && (
					<View
						position='absolute'
						backgroundColor='primary-700'
						width='12px'
						height='12px'
						right={-4}
						top={-2}
						borderRadius='circular'
					/>
				)}
			</View>

			<FacetsModal
				show={showModal}
				initialFilters={currentParams}
				onApplyFilters={_onApplyFilters}
				onRemoveFilters={_onRemoveFilters}
				modalReady={setFacetsModalReady}
				onClose={() => setShowModal(false)}
			/>
		</>
	)
}
