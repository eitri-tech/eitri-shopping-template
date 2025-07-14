import Eitri from 'eitri-bifrost'
import { CustomButton, CustomInput, Loading, cartShippingResolver } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { View, Text, Radio } from 'eitri-luminus'
import { simulateCart, resolveZipCode } from '../../services/freigthService'
import { useState, useEffect } from 'react'
import { Button } from 'eitri-luminus'
import { savePostalCodeOnStorage } from '../../services/customerService'

export default function Freight(props) {
	const { cart, setNewAddress, setFreight } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [zipCode, setZipCode] = useState('')
	const [isUnavailable, setIsUnavailable] = useState(false)
	const [messagesError, setMessagesError] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedOption, setSelectedOption] = useState('')
	const [error, setError] = useState(false)

	useEffect(() => {
		if (cart) {
		}
	}, [cart])

	const onInputZipCode = e => {
		setZipCode(e.target.value)
	}

	const onPressZipCodeChange = async () => {
		if (!zipCode) {
			return
		}
		if (!(zipCode.length == 8 || zipCode.length == 9)) {
			setError(t('freight.errorCep'))
			return
		}
		fetchFreight(zipCode)
	}

	const fetchFreight = async zipCode => {
		setIsLoading(true)
		try {
			setError('')
			savePostalCodeOnStorage(zipCode)

			const newCart = await setNewAddress(cart, zipCode)
		} catch (error) {
			console.error('Error fetching freight [1]', error)
			setError(t('freight.errorCalcFreight'))
		} finally {
			setIsLoading(false)
		}
	}

	const onSetCartFreight = async option => {
		if (selectedOption !== option.label) {
			setSelectedOption(option.label)
			await setCartFreight(option)
		}
	}

	const setCartFreight = async option => {
		try {
			await updateCartFreight(cart, option)
		} catch (error) {
			console.error('setCartFreight Error', error)
			setError(t('freight.errorEditFreight'))
		}
	}

	const handleOptionSelect = async option => {
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
		// onSetCartFreight(option)
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

	// console.log('shipping', shipping)

	// Separar opções de entrega e retirada
	const deliveryOptions = shipping?.options?.filter(option => !option.isPickupInPoint) || []
	const pickupOptions = shipping?.options?.filter(option => option.isPickupInPoint) || []

	return (
		<View className='px-4'>
			<View className='bg-white rounded shadow-sm border border-gray-300 p-4'>
				<Text className='text-base font-bold'>{t('freight.txtDelivery')}</Text>

				{cart?.canEditData ? (
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
				) : (
					<View className='mt-2'>
						<Text className='text-base font-medium'>{`${t('freight.labelZipCode')}: ${
							shipping?.postalCode
						}`}</Text>
					</View>
				)}

				{error && (
					<View className='mt-1'>
						<Text className='text-xs text-red-600'>{error}</Text>
					</View>
				)}

				{shipping && shipping?.options.length > 0 && (
					<>
						{/* Opções de Entrega */}
						{deliveryOptions.length > 0 && (
							<View className='mt-4'>
								<Text className='text-sm font-semibold text-neutral-700 mb-2'>
									{t('freight.tabDelivery') || 'Entrega'}
								</Text>
								<View className='flex flex-col p-4 border border-neutral-300 rounded items-center justify-between gap-2'>
									{deliveryOptions.map((item, index) => (
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

						{/* Opções de Retirada */}
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
