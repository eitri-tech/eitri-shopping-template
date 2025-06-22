import { CustomButton } from 'shopping-vtex-template-shared'
import { View, Text } from 'eitri-luminus'
export default function ModalConfirm(props) {
	const { text, showModal, removeItem, closeModal } = props

	return (
		<Modal
			show={showModal}
			position={'center'}
			onClose={closeModal}>
			<View className='flex flex-col px-6 py-6 bg-accent-100 items-center rounded-md border border-neutral-300 w-4/5'>
				<View className='flex flex-col w-full items-center justify-center'>
					<Text className='text-center text-base font-bold'>{text}</Text>
					<View className='w-full'>
						<CustomButton
							label={'Excluir'}
							onPress={() => removeItem(true)}
							block
						/>
						<CustomButton
							variant='outlined'
							label={'Cancelar'}
							onPress={() => removeItem(false)}
							block
						/>
					</View>
				</View>
			</View>
		</Modal>
	)
}
