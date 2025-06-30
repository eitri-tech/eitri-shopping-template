import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	Loading,
	HeaderReturn,
	HeaderContentWrapper,
	HeaderText,
	CustomInput
} from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import { Page } from 'eitri-luminus'

export default function AddressForm(props) {
	const { cart, setNewAddressToCart, updateCartAddress } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)
	const [hasCartError, setHasCartError] = useState(false)
	const [addressFound, setAddressFound] = useState(null)
	const [addressError, setAddressError] = useState('')
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

	useEffect(() => {
		const _address = cart?.shipping?.address

		if (!_address) return

		setAddress({
			..._address,
			receiverName:
				_address.receiverName || `${cart?.clientProfileData?.firstName} ${cart?.clientProfileData?.lastName}`
		})

		setAddressFound(true)
		setIsPristine(false)

		sendPageView('Formulário de Endereço')
	}, [cart])

	const handleAddressChange = (key, value) => {
		setAddress({
			...address,
			[key]: key === 'receiverName' ? value.replace(/[^a-zA-Z\s]/g, '') : value
		})
	}

	const onChangePostalCodeInput = async e => {
		const { value } = e.target
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

	const isValidAddress = () => {
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

	if (hasCartError) {
		return (
			<Page title='Checkout - Formulário de Endereço'>
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
			</Page>
		)
	}

	return (
		<Page title='Checkout - Formulário de Endereço'>
			<View className='min-h-[100vh] flex flex-col'>
				<HeaderContentWrapper
					gap={16}
					scrollEffect={false}>
					<HeaderReturn />
					<HeaderText text={t('addNewShippingAddress.title')} />
				</HeaderContentWrapper>

				<Loading
					fullScreen
					isLoading={isLoading}
				/>

				<View className='flex-1 flex flex-col p-4'>
					<View className='flex flex-col gap-4 flex-1'>
						{addressError && <Text className='mt-2 text-red-700'>{addressError}</Text>}
						<View className='flex gap-2 items-end'>
							<CustomInput
								label={t('addNewShippingAddress.txtCalculate')}
								inputMode='numeric'
								placeholder='12345-678'
								className='w-[70%]'
								value={address?.postalCode}
								onChange={onChangePostalCodeInput}
								autoFocus={isPristine}
								variant='mask'
								mask='99999-999'
							/>
							<CustomButton
								className='w-[30%]'
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
								{seeCompactedMode &&
								address?.street &&
								address?.neighborhood &&
								address?.city &&
								address?.state ? (
									<>
										<View className='w-full flex flex-col rounded border border-neutral-700 gap-2 p-2'>
											<Text className='text-xs text-neutral-900'>{`${address?.street}`}</Text>
											<Text className='text-xs text-neutral-900'>{`${address?.neighborhood}, ${address?.city} - ${address?.state}`}</Text>
											<Text className='text-xs text-neutral-900'>{`${address?.postalCode}`}</Text>
											<View className='flex justify-end'>
												<View onClick={() => setSeeCompactedMode(false)}>
													<Text className='font-bold text-primary-500'>
														{t('addNewShippingAddress.txtEdit')}
													</Text>
												</View>
											</View>
										</View>
										<View className='flex gap-4'>
											<View className='w-1/2'>
												<CustomInput
													label={t('addNewShippingAddress.frmNumber')}
													placeholder={''}
													value={address?.number || ''}
													onChange={text => handleAddressChange('number', text)}
												/>
											</View>
											<View className='w-1/2'>
												<CustomInput
													label={t('addNewShippingAddress.frmComplement')}
													placeholder={''}
													value={address?.complement || ''}
													onChange={text => handleAddressChange('complement', text)}
												/>
											</View>
										</View>
										<View className='flex gap-4'>
											<View className='w-full'>
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
										<View className='flex gap-4'>
											<View className='w-1/2'>
												<CustomInput
													label={t('addNewShippingAddress.frmNumber')}
													placeholder={''}
													value={address?.number || ''}
													onChange={text => handleAddressChange('number', text)}
												/>
											</View>
											<View className='w-1/2'>
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
										<View className='flex gap-4'>
											<View className='w-1/2'>
												<CustomInput
													label={t('addNewShippingAddress.frmCity')}
													placeholder={''}
													value={address.city || ''}
													onChange={text => handleAddressChange('city', text)}
												/>
											</View>
											<View className='w-1/2'>
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
					</View>
				</View>
				<View className='p-4'>
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
		</Page>
	)
}
