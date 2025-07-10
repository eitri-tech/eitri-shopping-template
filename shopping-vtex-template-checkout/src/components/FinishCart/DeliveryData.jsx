import SimpleCard from '../Card/SimpleCard'
import iconTruck from '../../assets/images/truck.svg'
import iconStore from '../../assets/images/store.svg'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { getShippingAddress } from '../../utils/getShippingAddress'
import { navigate } from '../../services/navigationService'
import { cartShippingResolver } from 'shopping-vtex-template-shared'
import { View, Text } from 'eitri-luminus'

export default function DeliveryData(props) {
	const { cart } = useLocalShoppingCart()
	const { t } = useTranslation()

	const onPressMainAction = async () => {
		navigate('FreightSelector')
	}

	const shippingAddress = getShippingAddress(cart)
	const shippingOptions = cartShippingResolver(cart)

	const selectedShippingOption = shippingOptions?.options?.find(s => s.isCurrent)

	return (
		<SimpleCard
			isFilled={!!shippingAddress}
			title={shippingAddress?.isPickUp ? t('deliveryData.txtWithdrawal') : t('deliveryData.txtDelivery')}
			icon={shippingAddress?.isPickUp ? iconStore : iconTruck}
			onPress={onPressMainAction}>
			{shippingAddress?.isPickUp ? (
				<>
					{/* Pickup Information */}
					{selectedShippingOption && (
						<View className='flex flex-col gap-3'>
							{/* Store Name and Price */}
							<View className='flex flex-row items-center justify-between'>
								<Text className='text-sm font-medium text-neutral-900'>
									{selectedShippingOption.label}
								</Text>
								<Text className='text-sm font-bold text-green-600'>{selectedShippingOption.price}</Text>
							</View>

							{/* Pickup Estimate */}
							{selectedShippingOption.shippingEstimate && (
								<View className='flex flex-row items-center gap-2'>
									<svg
										width='16'
										height='16'
										viewBox='0 0 16 16'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 12.5c-3.038 0-5.5-2.462-5.5-5.5S4.962 2.5 8 2.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z'
											fill='#16A34A'
										/>
										<path
											d='M8 4v4l3 2'
											stroke='#16A34A'
											strokeWidth='1'
											fill='none'
										/>
									</svg>
									<Text className='text-xs text-green-700 font-medium'>
										{selectedShippingOption.shippingEstimate}
									</Text>
								</View>
							)}

							{/* Store Address */}
							<View className='bg-neutral-50 p-3 rounded-lg'>
								<Text className='text-sm font-medium text-neutral-900 mb-2'>Endereço da Loja</Text>
								<View className='flex flex-col gap-1'>
									<Text className='text-xs text-neutral-700'>
										{`${shippingAddress?.street}, ${shippingAddress?.number}${
											shippingAddress?.complement ? ` - ${shippingAddress?.complement}` : ''
										}`}
									</Text>
									<Text className='text-xs text-neutral-700'>
										{`${shippingAddress?.neighborhood}, ${shippingAddress?.city} - ${shippingAddress?.state}`}
									</Text>
									<Text className='text-xs text-neutral-700'>
										{`CEP: ${shippingAddress?.postalCode}`}
									</Text>
								</View>
							</View>

							{/* Important Information */}
							{selectedShippingOption.slas?.[0]?.pickupStoreInfo?.additionalInfo && (
								<View className='bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400'>
									<View className='flex flex-row items-start gap-2'>
										<svg
											width='16'
											height='16'
											viewBox='0 0 16 16'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
											className='mt-0.5 flex-shrink-0'>
											<path
												d='M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 12.5c-3.038 0-5.5-2.462-5.5-5.5S4.962 2.5 8 2.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z'
												fill='#2563EB'
											/>
											<path
												d='M8 6v4M8 4h.01'
												stroke='white'
												strokeWidth='1.5'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
										<Text className='text-xs text-blue-800 leading-relaxed'>
											{selectedShippingOption.slas[0].pickupStoreInfo.additionalInfo}
										</Text>
									</View>
								</View>
							)}
						</View>
					)}
				</>
			) : (
				<>
					{/* Delivery Information */}
					{selectedShippingOption && (
						<View className='flex flex-col gap-3'>
							{/* Shipping Method and Price */}
							<View className='flex flex-row items-center justify-between'>
								<Text className='text-sm font-medium text-neutral-900'>
									{selectedShippingOption.label}
								</Text>
								<Text className='text-sm font-bold text-green-600'>{selectedShippingOption.price}</Text>
							</View>

							{/* Delivery Estimate */}
							{selectedShippingOption.shippingEstimate && (
								<View className='flex flex-row items-center gap-2'>
									<svg
										width='16'
										height='16'
										viewBox='0 0 16 16'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'>
										<path
											d='M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 12.5c-3.038 0-5.5-2.462-5.5-5.5S4.962 2.5 8 2.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z'
											fill='#16A34A'
										/>
										<path
											d='M8 4v4l3 2'
											stroke='#16A34A'
											strokeWidth='1'
											fill='none'
										/>
									</svg>
									<Text className='text-xs text-green-700 font-medium'>
										{selectedShippingOption.shippingEstimate}
									</Text>
								</View>
							)}

							{/* Delivery Address */}
							<View className='bg-neutral-50 p-3 rounded-lg'>
								<Text className='text-sm font-medium text-neutral-900 mb-2'>Endereço de Entrega</Text>
								<View className='flex flex-col gap-1'>
									<Text className='text-xs text-neutral-700'>
										{`${shippingAddress?.street}, ${
											shippingAddress?.number === null
												? t('deliveryData.txtNoNumber')
												: shippingAddress?.number
										}${shippingAddress?.complement ? ` - ${shippingAddress?.complement}` : ''}`}
									</Text>
									<Text className='text-xs text-neutral-700'>
										{`${shippingAddress?.neighborhood}, ${shippingAddress?.city} - ${shippingAddress?.state}`}
									</Text>
									<Text className='text-xs text-neutral-700'>
										{`CEP: ${shippingAddress?.postalCode}`}
									</Text>
								</View>
							</View>

							{/* Alert for missing number */}
							{!shippingAddress?.number && (
								<View className='bg-red-50 p-3 rounded-lg border-l-4 border-red-400'>
									<View className='flex flex-row items-start gap-2'>
										<svg
											width='16'
											height='16'
											viewBox='0 0 16 16'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
											className='mt-0.5 flex-shrink-0'>
											<path
												d='M8 1C4.134 1 1 4.134 1 8s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7zm0 12.5c-3.038 0-5.5-2.462-5.5-5.5S4.962 2.5 8 2.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z'
												fill='#DC2626'
											/>
											<path
												d='M8 6v4M8 4h.01'
												stroke='white'
												strokeWidth='1.5'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
										<Text className='text-xs text-red-800 leading-relaxed'>
											{t('deliveryData.txtAlert')}
										</Text>
									</View>
								</View>
							)}
						</View>
					)}
				</>
			)}
		</SimpleCard>
	)
}
