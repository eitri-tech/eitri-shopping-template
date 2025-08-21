import { CustomButton, CustomInput, Loading, cartShippingResolver } from 'eitri-shopping-montreal-shared'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { View, Text, Radio } from 'eitri-luminus'
import { useState, useEffect } from 'react'
import { loadPostalCodeFromStorage, savePostalCodeOnStorage } from '../../services/customerService'

export default function Freight(props) {
	const { cart, setNewAddress, setFreight } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [zipCode, setZipCode] = useState('')
	const [isUnavailable, setIsUnavailable] = useState(false)
	const [messagesError, setMessagesError] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(false)
	const [isEditingZipCode, setIsEditingZipCode] = useState(false)

	useEffect(() => {
		if (cart) {
			if (!cart?.shippingData?.address) {
				loadPostalCodeFromStorage().then(postalCode => {
					if (postalCode) {
						setZipCode(postalCode)
						fetchFreight(postalCode)
					}
				})
			} else {
				setZipCode(cart?.shippingData?.address?.postalCode)
				fetchFreight(cart?.shippingData?.address?.postalCode)
			}
		}
	}, [])

	const onInputZipCode = e => {
		setZipCode(e.target.value)
	}

	const onPressZipCodeChange = async () => {
		try {
			if (!zipCode) {
				return
			}
			if (!(zipCode.length == 8 || zipCode.length == 9)) {
				setError(t('freight.errorCep'))
				return
			}
			fetchFreight(zipCode)
		} catch (e) {
			console.error('Error onPressZipCodeChange', e)
		}
	}

	const onPressEditZipCode = () => {
		setIsEditingZipCode(true)
		setZipCode('')
		setError('')
	}

	const fetchFreight = async zipCode => {
		setIsLoading(true)
		try {
			setError('')

			savePostalCodeOnStorage(zipCode)

			await setNewAddress(cart, zipCode)
		} catch (error) {
			console.error('Error fetching freight', error)
			setError(t('freight.errorCalcFreight'))
		} finally {
			setIsLoading(false)
		}
	}

	const handleOptionSelect = async option => {
		try {
			setIsLoading(true)
			const payload = {
				clearAddressIfPostalCodeNotFound: true,
				logisticsInfo: option?.slas?.map(sla => {
					return {
						itemIndex: sla.itemIndex,
						selectedDeliveryChannel: sla.deliveryChannel,
						selectedSla: sla.id
					}
				}),
				selectedAddresses: cart?.shippingData?.selectedAddresses
			}
			await setFreight(payload)
			setIsLoading(false)
		} catch (e) {
			console.log('Error handleOptionSelect', e)
			setIsLoading(false)
		}
	}

	const getMessageError = label => {
		const message = messagesError.find(item => item.code === 'cannotBeDelivered')
		return (
			<View className='w-full px-2'>
				<Text className='font-bold'>{label}</Text>
				{message && <Text className='text-xs text-tertiary-700'>{message.fields.skuName}</Text>}
			</View>
		)
	}

	if (!cart) return null

	const shipping = cartShippingResolver(cart)
	const deliveryOptions = shipping?.options?.filter(option => !option.isPickupInPoint) || []
	const pickupOptions = shipping?.options?.filter(option => option.isPickupInPoint) || []

	return (
		<View className='px-4'>
			<View className='bg-white rounded shadow-sm border border-gray-300 p-4'>
				<Text className='text-base font-bold'>{t('freight.txtDelivery')}</Text>

				{cart?.canEditData || isEditingZipCode ? (
					<>
						<View className='flex justify-between mt-2 gap-2 items-center w-full'>
							<View className='w-2/3'>
								<CustomInput
									placeholder={t('freight.labelZipCode')}
									value={zipCode}
									variant='mask'
									mask='99999-999'
									inputMode='numeric'
									onChange={onInputZipCode}
								/>
							</View>
							<View className='w-1/3'>
								<CustomButton
									variant='outlined'
									isLoading={isLoading}
									label={t('freight.txtCalculate')}
									onPress={onPressZipCodeChange}
								/>
							</View>
						</View>
					</>
				) : (
					<View className='mt-2 flex flex-row items-center gap-4'>
						<Text className='text-base font-medium'>{`Receber em ${shipping?.postalCode}`}</Text>

						<View onClick={onPressEditZipCode}>
							<Text className='text-sm text-primary font-bold'>alterar</Text>
						</View>
					</View>
				)}

				{!shipping?.shippingAvailable && (
					<View className='mt-2 p-2 bg-red-50 border border-red-200 rounded'>
						<Text className='text-sm text-red-600 font-medium'>Entrega indisponível</Text>
					</View>
				)}

				{isLoading && <View className={`mt-4 w-full h-[120px] bg-gray-200 rounded animate-pulse`} />}

				{!isLoading && shipping && shipping?.options.length > 0 && (
					<>
						{deliveryOptions.length > 0 && (
							<View className='mt-4'>
								<Text className='text-sm font-semibold text-neutral-700 mb-2'>
									{t('freight.tabDelivery')}
								</Text>

								<View className='flex flex-col p-4 mt-2 border border-neutral-300 rounded items-center justify-between gap-2'>
									{deliveryOptions.map((item, index) => (
										<View
											key={index}
											className='flex flex-row items-center w-full'>
											{isUnavailable ? (
												getMessageError(item?.label)
											) : (
												<View
													className='flex flex-row items-center w-full'
													sendFocusToInput>
													<Radio
														className='radio-primary'
														checked={item.isCurrent}
														name='freight-option'
														value={item?.label}
														onChange={() => handleOptionSelect(item)}
													/>
													<View className='w-full flex flex-col flex-1 ml-3'>
														<Text className='font-bold'>{item?.label}</Text>
														<Text className='text-xs text-neutral-500'>
															{item?.shippingEstimate}
														</Text>
													</View>
													<View className='flex items-center'>
														<Text className='font-semibold'>{item?.price}</Text>
													</View>
												</View>
											)}
										</View>
									))}
								</View>
							</View>
						)}

						{pickupOptions.length > 0 && (
							<View className='mt-4'>
								<Text className='text-sm font-semibold text-neutral-700 mb-2'>
									{t('freight.tabPickup') || 'Retirada'}
								</Text>
								<View className='flex flex-col p-4 border border-neutral-300 rounded items-center justify-between gap-2'>
									{pickupOptions.map((item, index) => (
										<View
											key={index}
											className='flex flex-row items-center w-full'>
											{isUnavailable ? (
												getMessageError(item?.label)
											) : (
												<>
													{isLoading ? (
														<View className='w-full flex items-center justify-center'>
															<Loading />
														</View>
													) : (
														<>
															<Radio
																className='radio-primary'
																checked={item.isCurrent}
																name='freight-option'
																value={item?.label}
																onChange={() => handleOptionSelect(item)}
															/>
															<View className='w-full flex flex-col flex-1 ml-3'>
																<Text className='font-bold'>{item?.label}</Text>
																<Text className='text-xs text-neutral-500'>
																	{item?.shippingEstimate}
																</Text>
																{item.isPickupInPoint && (
																	<Text className='text-xs text-neutral-500'>
																		{item?.pickUpAddress}
																	</Text>
																)}
															</View>
															<View className='flex items-center'>
																<Text className='font-semibold'>{item?.price}</Text>
															</View>
														</>
													)}
												</>
											)}
										</View>
									))}
								</View>
							</View>
						)}
					</>
				)}
			</View>
		</View>
	)
}
