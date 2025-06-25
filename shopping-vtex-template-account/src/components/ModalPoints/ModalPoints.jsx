import { Divisor, CustomButton, Spacing } from 'shopping-vtex-template-shared'
import Eitri from 'eitri-bifrost'

// TODO - precisa internacionalizar?
export default function ModalPoints(props) {
	const { showModal, closeModal, modalInfo, rescuePoints, loadingButton } = props

	const [buttonTextLabel, setButtonTextLabel] = useState('Copiar')

	const copyCoupon = async code => {
		await Eitri.clipboard.setText({
			text: code
		})
		setButtonTextLabel('Copiado')
	}
	return (
		<Modal
			show={showModal}
			position={'center'}
			showBackdrop={true}
			onClose={() => closeModal()}>
			<View className='flex justify-center bg-blue-50 border border-gray-300 rounded-full flex-col p-4 w-4/5'>
				{modalInfo.type === 'selectedPoint' && (
					<View>
						<View className='flex flex-col justify-center items-center p-4'>
							<Text className='font-bold text-blue-700'>Cupom de:</Text>
							<Text className='text-lg font-bold'>{modalInfo.item.Title}</Text>
							<Text className='font-bold'>{`por ${modalInfo.item.Points} pontos`}</Text>
						</View>
						<Divisor />
						<View className='flex flex-col justify-center items-center py-4'>
							<View className='flex items-center bg-gray-100 rounded-full p-3'>
								<View className='p-3'>
									{/*<Icon*/}
									{/*	width={24}*/}
									{/*	height={24}*/}
									{/*	color={'neutral-900'}*/}
									{/*	iconKey='alert-circle'*/}
									{/*/>*/}
								</View>

								<Text className='font-bold'>{modalInfo.item.Description}</Text>
							</View>
						</View>
						<CustomButton
							marginTop='large'
							label={'Confirmar'}
							onPress={() => rescuePoints(modalInfo.item.Id)}
							isLoanding={loadingButton}
							block
						/>
						<Spacing height={'10px'} />

						<CustomButton
							marginTop='large'
							label={'Cancelar'}
							onPress={() => closeModal()}
							backgroundColor='neutral-100'
							color='primary-700'
							block
						/>
					</View>
				)}
				{modalInfo.type === 'rescueSuccess' && (
					<View>
						<View className='flex flex-col items-center p-3'>
							{/*<Icon*/}
							{/*	width={35}*/}
							{/*	height={35}*/}
							{/*	color={'positive-700'}*/}
							{/*	iconKey='check-circle'*/}
							{/*/>*/}
							<Text className='text-xl font-bold'>Troca Confirmada</Text>
						</View>
						<View className='flex flex-col items-center p-3 justify-center'>
							<Text className='text-center text-gray-500 font-bold'>
								{modalInfo.response.Item.ResultMessage}
							</Text>
							{modalInfo.response.Item.HasCouponCode && (
								<View className='border border-gray-100 rounded-md p-4 m-3'>
									<Text className='break-words'>{modalInfo.response.Item.CouponCode}</Text>
								</View>
							)}
							<Text className='text-center text-gray-500 font-bold'>
								{modalInfo.response.Item.AfterMessage}
							</Text>
						</View>
						<Spacing height={'10px'} />
						<View>
							{modalInfo.response.Item.HasCouponCode && (
								<CustomButton
									marginTop='large'
									label={buttonTextLabel}
									onPress={() => copyCoupon(modalInfo.response.Item.CouponCode)}
									block
								/>
							)}
							<Spacing height={'10px'} />

							<CustomButton
								marginTop='large'
								label={'Fechar'}
								onPress={() => closeModal()}
								backgroundColor='neutral-100'
								color='primary-700'
								block
							/>
						</View>
					</View>
				)}
			</View>
		</Modal>
	)
}
