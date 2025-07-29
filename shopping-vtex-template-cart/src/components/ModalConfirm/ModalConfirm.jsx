import { CustomButton } from 'shopping-vtex-template-shared'
import { View, Text, Modal } from 'eitri-luminus'
export default function ModalConfirm(props) {
	const { text, showModal, removeItem, closeModal } = props

	if (!showModal) return null

	return (
		<View
			className='z-[9999] !bg-black/70 !opacity-100 fixed inset-0 flex items-center justify-center'
			onClick={() => {
				if (typeof onClose === 'function') onClose()
			}}>
			<View className='flex flex-col p-4 bg-base-100 items-center rounded w-11/12 max-w-xs mx-auto'>
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
						onClick={closeModal}
					/>
				</View>
			</View>
		</View>
	)
}
