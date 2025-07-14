import { CustomButton } from 'shopping-vtex-template-shared'
import { View, Text, Modal } from 'eitri-luminus'
export default function ModalConfirm(props) {
	const { text, showModal, removeItem, closeModal } = props

	if (!showModal) return null

	return (
		<Modal className='z-[9999]'>
			<View
				className='flex flex-col p-4 bg-base-100 items-center rounded w-11/12 max-w-xs mx-auto'
				onClick={() => console.log('console')}>
				<Text className='text-center text-lg font-bold mb-6 text-base-content'>{text}</Text>
				<View className='flex flex-col gap-3 w-full'>
					<CustomButton
						label={'Excluir'}
						className='btn-error btn-block'
						onClick={removeItem}
					/>
					<CustomButton
						variant='outlined'
						label={'Cancelar'}
						onClick={() => console.log('console')}
					/>
				</View>
			</View>
		</Modal>
	)
}
