import Eitri from 'eitri-bifrost'
import { CustomButton, CustomInput, Loading, cartShippingResolver } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { View, Text, Radio } from 'eitri-luminus'
import { simulateCart, resolveZipCode } from '../../services/freigthService'
import { useState, useEffect } from 'react'
import { Button } from 'eitri-luminus'

export default function Freight(props) {
	const { cart, setNewAddress } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [zipCode, setZipCode] = useState('')
	const [isUnavailable, setIsUnavailable] = useState(false)
	const [messagesError, setMessagesError] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedOption, setSelectedOption] = useState('')
	const [error, setError] = useState(false)
	const [selectedTab, setSelectedTab] = useState('delivery') // 'delivery' ou 'pickup'

	useEffect(() => {
		if (cart) {
			// loadZipCode()
		}
	}, [cart])

	const loadZipCode = async () => {
		try {
			if (cart?.shippingData?.address) {
				const shipping = cartShippingResolver(cart)
				console.log('shipping', shipping)
				//setShipping(shipping)
				return
			}
			const zipCode = await getZipCodeOnStorage()
			if (!zipCode) {
				return
			}
			setZipCode(zipCode)
			fetchFreight(zipCode)
		} catch (error) {
			console.error('Error fetching freight [1]', error)
		}
	}

	const getZipCodeOnStorage = async () => {
		return await Eitri.sharedStorage.getItem('zipCode')
	}

	const setZipCodeOnStorage = async zipCode => {
		await Eitri.sharedStorage.setItem('zipCode', zipCode)
	}

	const onInputZipCode = e => {
		setZipCode(e.target.value)
	}

	const handleZipCodeChange = async () => {
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
			console.log('zipCode', zipCode)
			setError('')
			setZipCodeOnStorage(zipCode)

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
			setSlaOptionVisible(false)
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

	// Separar opções de entrega e retirada
	const deliveryOptions = shipping?.options?.filter(option => !option.isPickupInPoint) || []
	const pickupOptions = shipping?.options?.filter(option => option.isPickupInPoint) || []

	return (
		<View className='p-4'>
			<View className='bg-white rounded shadow-sm border border-gray-300 p-4 mb-4'>
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
								onPress={handleZipCodeChange}
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
						{/* Tabs - agora fora da caixa com borda */}
						<View className='flex w-full mb-0 mt-2'>
							<View
								className={`flex-1 py-2 text-center rounded-t-lg cursor-pointer ${
									selectedTab === 'delivery'
										? 'bg-primary text-white font-bold shadow'
										: 'bg-base-200 text-neutral-700'
								}`}
								onClick={() => setSelectedTab('delivery')}>
								<Text className='text-base'>{t('freight.tabDelivery') || 'Entrega'}</Text>
							</View>
							<View
								className={`flex-1 py-2 text-center rounded-t-lg cursor-pointer ${
									selectedTab === 'pickup'
										? 'bg-primary text-white font-bold shadow'
										: 'bg-base-200 text-neutral-700'
								}`}
								onClick={() => setSelectedTab('pickup')}>
								<Text className='text-base'>{t('freight.tabPickup') || 'Retirada'}</Text>
							</View>
						</View>
						<View className='flex flex-col p-4 border border-neutral-300 rounded items-center justify-between gap-2'>
							{/* Lista de opções conforme a aba */}
							{(selectedTab === 'delivery' ? deliveryOptions : pickupOptions).length === 0 ? (
								<Text className='text-xs text-neutral-500 w-full text-center'>
									{selectedTab === 'delivery'
										? t('freight.noDeliveryOptions') || 'Nenhuma opção de entrega disponível'
										: t('freight.noPickupOptions') || 'Nenhuma opção de retirada disponível'}
								</Text>
							) : (
								(selectedTab === 'delivery' ? deliveryOptions : pickupOptions).map((item, index) => (
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
														<View className='w-full flex flex-col'>
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
														<View className='flex w-3/10 justify-end p-2'>
															<Text>{item?.price}</Text>
														</View>
													</>
												)}
											</>
										)}
									</View>
								))
							)}
						</View>
					</>
				)}
			</View>
		</View>
	)
}
