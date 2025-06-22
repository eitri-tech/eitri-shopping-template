import Eitri from 'eitri-bifrost'
import { CustomButton, Loading, HeaderTemplate, HEADER_TYPE, CustomInput } from 'shopping-vtex-template-shared'
import ShippingMethods from '../components/Methods/ShippingMethods'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'

export default function AddNewShippingAddress(props) {
	const { cart, setNewAddressToCart, updateCartFreight, updateCartAddress } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)
	const [hasCartError, setHasCartError] = useState(false)
	const [addressFound, setAddressFound] = useState(null)
	const [adressError, setAddressError] = useState('')
	const [seeCompactedMode, setSeeCompactedMode] = useState(true)

	const [isPristine, setIsPristine] = useState(true)

	const { t } = useTranslation()

	const [address, setAddress] = useState({
		postalCode: '',
		street: '',
		neighborhood: '',
		city: '',
		state: '',
		country: '',
		geoCoordinates: [],
		number: '',
		complement: '',
		reference: '',
		receiverName: cart?.clientProfileData
			? `${cart?.clientProfileData.firstName} ${cart?.clientProfileData.lastName}`
			: '',
		addressQuery: '',
		addressType: ''
	})

	const [customLogisticInfo, setCustomLogisticInfo] = useState([])

	useEffect(() => {
		const _address = cart?.shipping?.address

		if (!_address) return

		setAddress({
			..._address,
			receiverName:
				_address.receiverName || `${cart?.clientProfileData?.firstName} ${cart?.clientProfileData?.lastName}`
		})

		setAddressFound(true)

		setCustomLogisticInfo(cart.shipping)

		setIsPristine(false)

		sendPageView('Entrega')
	}, [cart])

	const handleAddressChange = (key, value) => {
		setAddress({
			...address,
			[key]: key === 'receiverName' ? value.replace(/[^a-zA-Z\s]/g, '') : value
		})
	}

	const onChangePostalCodeInput = async text => {
		let value = text.replace(/\D/g, '')

		if (value.length > 5) {
			value = value.replace(/(\d{5})(\d)/, '$1-$2')
		}

		if (value.length > 9) {
			value = value.substr(0, 9)
		}

		setAddress({ ...address, postalCode: value })
	}

	const submitZipCode = async () => {
		setIsLoading(true)
		setIsPristine(false)
		await setNewAddressToCart(cart, address.postalCode)
		setIsLoading(false)
	}

	const submit = async () => {
		setAddressError('')
		try {
			await updateCartAddress(cart, address)
			Eitri.navigation.back()
		} catch (e) {
			if (e.response?.status === 400) {
				setAddressError(t('addNewShippingAddress.errorAddress'))
				console.error('Error on submit', e)
				return
			}
			setAddressError(t('addNewShippingAddress.errorDefault'))
			console.error('Error on submit', e)
			return
		}
	}

	const onSelectCustomLogistiInfoOption = async customLogisticInfoOption => {
		await updateCartFreight(cart, customLogisticInfoOption)
	}

	const isValidAddress = () => {
		if (currentDeliveryIsPickUp()) {
			return true
		}
		return (
			address?.postalCode &&
			address?.street &&
			address?.neighborhood &&
			address?.city &&
			address?.state &&
			address?.receiverName &&
			address?.number
		)
	}

	const currentDeliveryIsPickUp = () => {
		return customLogisticInfo?.options?.some(option => option.isPickupInPoint && option.isCurrent)
	}

	const getPickupAddress = () => {
		const pickUpLogistic = customLogisticInfo?.options?.find(option => option.isPickupInPoint && option.isCurrent)
		return pickUpLogistic?.slas?.[0].pickupStoreInfo?.friendlyName
	}

	if (hasCartError) {
		return (
			<Window
				topInset
				bottomInset>
				<View
					position='fixed'
					overflow='hidden'
					bottom='5%'
					alignSelf='center'
					elevation='low'
					backgroundColor='warning-100'
					padding='small'
					borderRadius='small'>
					<Text
						fontWeight='bold'
						color='tertiary-100'>
						{hasCartError.message}
					</Text>
				</View>
			</Window>
		)
	}

	return (
		<Window
			bottomInset
			topInset>
			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			<HeaderTemplate
				headerType={HEADER_TYPE.RETURN_AND_TEXT}
				viewBackButton={true}
				contentText={t('addNewShippingAddress.title')}
			/>
			<View padding='large'>
				<View
					direction='column'
					gap={16}>
					{adressError && (
						<Text
							marginTop='nano'
							color='negative-700'>
							{adressError}
						</Text>
					)}

					<View
						display='flex'
						gap={8}
						alignItems='end'>
						<CustomInput
							label={t('addNewShippingAddress.txtCalculate')}
							type='number'
							inputMode='numeric'
							placeholder='12345-678'
							height='37px'
							value={address?.postalCode}
							onChange={value => onChangePostalCodeInput(value)}
							autoFocus={isPristine}
						/>
						<CustomButton
							height='37px'
							width='50px'
							label='OK'
							onPress={submitZipCode}
							display='flex'
							justifyContent='center'
						/>
					</View>

					{isLoading && (
						<View>
							<Text>Aguarde...</Text>
						</View>
					)}

					{addressFound && (
						<>
							{customLogisticInfo && (
								<ShippingMethods
									onSelectCustomLogistiInfoOption={onSelectCustomLogistiInfoOption}
									customLogisticInfo={customLogisticInfo}
								/>
							)}

							{currentDeliveryIsPickUp() ? (
								<View>
									<Text
										fontWeight='bold'
										fontSize='extra-small'
										marginBottom='nano'>
										{t('addNewShippingAddress.txtPickupAddress')}
									</Text>
									<View
										width='100%'
										direction='column'
										borderRadius='small'
										borderWidth='hairline'
										borderColor='neutral-700'
										gap={10}
										padding='small'>
										<Text
											fontSize='extra-small'
											color='neutral-900'>
											{getPickupAddress()}
										</Text>
									</View>
								</View>
							) : (
								<>
									{seeCompactedMode &&
									address?.street &&
									address?.neighborhood &&
									address?.city &&
									address?.state ? (
										<>
											<View
												width='100%'
												direction='column'
												borderRadius='small'
												borderWidth='hairline'
												borderColor='neutral-700'
												gap={10}
												padding='small'>
												<Text
													fontSize='extra-small'
													color='neutral-900'>
													{`${address?.street}`}
												</Text>
												<Text
													fontSize='extra-small'
													color='neutral-900'>{`${address?.neighborhood}, ${address?.city} - ${address?.state}`}</Text>
												<Text
													fontSize='extra-small'
													color='neutral-900'>{`${address?.postalCode}`}</Text>

												<View
													display={'flex'}
													justifyContent={'end'}>
													<View onClick={() => setSeeCompactedMode(false)}>
														<Text
															fontWeight={'bold'}
															color={'primary-500'}>
															{t('addNewShippingAddress.txtEdit')}
														</Text>
													</View>
												</View>
											</View>

											<View
												direction='row'
												gap={16}>
												<View width='50%'>
													<CustomInput
														label={t('addNewShippingAddress.frmNumber')}
														placeholder={''}
														value={address?.number || ''}
														onChange={text => handleAddressChange('number', text)}
													/>
												</View>
												<View width='50%'>
													<CustomInput
														label={t('addNewShippingAddress.frmComplement')}
														placeholder={''}
														value={address?.complement || ''}
														onChange={text => handleAddressChange('complement', text)}
													/>
												</View>
											</View>
											<View
												direction='row'
												gap={16}>
												<View width='100%'>
													<CustomInput
														label={t('addNewShippingAddress.frmReference')}
														placeholder={''}
														value={address?.reference || ''}
														onChange={text => handleAddressChange('reference', text)}
													/>
												</View>
											</View>
											<View>
												<CustomInput
													placeholder={t('addNewShippingAddress.frmReceiveName')}
													label={t('addNewShippingAddress.frmReceiveName')}
													value={address?.receiverName || ''}
													onChange={text => handleAddressChange('receiverName', text)}
												/>
											</View>
										</>
									) : (
										<>
											<View>
												<CustomInput
													label={t('addNewShippingAddress.frmStreet')}
													placeholder={''}
													value={address?.street || ''}
													onChange={text => handleAddressChange('street', text)}
												/>
											</View>

											<View
												direction='row'
												gap={16}>
												<View width='50%'>
													<CustomInput
														label={t('addNewShippingAddress.frmNumber')}
														placeholder={''}
														value={address?.number || ''}
														onChange={text => handleAddressChange('number', text)}
													/>
												</View>
												<View width='50%'>
													<CustomInput
														label={t('addNewShippingAddress.frmComplement')}
														placeholder={''}
														value={address?.complement || ''}
														onChange={text => handleAddressChange('complement', text)}
													/>
												</View>
											</View>

											<View>
												<CustomInput
													label={t('addNewShippingAddress.frmNeighborhood')}
													placeholder={''}
													value={address.neighborhood || ''}
													onChange={text => handleAddressChange('neighborhood', text)}
												/>
											</View>

											<View
												direction='row'
												gap={16}>
												<View width='50%'>
													<CustomInput
														label={t('addNewShippingAddress.frmCity')}
														placeholder={''}
														value={address.city || ''}
														onChange={text => handleAddressChange('city', text)}
													/>
												</View>
												<View width='50%'>
													<CustomInput
														label={t('addNewShippingAddress.frmState')}
														placeholder={''}
														value={address?.state || ''}
														onChange={text => handleAddressChange('state', text)}
													/>
												</View>
											</View>
											<View>
												<CustomInput
													placeholder={t('addNewShippingAddress.frmReceiveName')}
													label={t('addNewShippingAddress.frmReceiveName')}
													value={address?.receiverName || ''}
													onChange={text => handleAddressChange('receiverName', text)}
												/>
											</View>
										</>
									)}
								</>
							)}
						</>
					)}

					<CustomButton
						width='100%'
						marginTop='large'
						label={t('addNewShippingAddress.labelButton')}
						fontSize='medium'
						disabled={!isValidAddress()}
						onPress={submit}
					/>
				</View>
			</View>
		</Window>
	)
}
