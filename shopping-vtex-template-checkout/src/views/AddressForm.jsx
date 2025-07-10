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
import { resolvePostalCode } from '../services/freigthService'
import { navigate } from '../services/navigationService'

export default function AddressForm(props) {
	const PAGE_NAME = 'Checkout - Cadastro de Endereço'

	const { cart, setNewAddress } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(false)
	const [addressError, setAddressError] = useState('')
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
		addressType: 'residential',
		isDisposable: false
	})

	useEffect(() => {
		sendPageView(PAGE_NAME)
	}, [])

	const handleAddressChange = (key, e) => {
		const { value } = e.target
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
		try {
			if (!address.postalCode) return
			setIsLoading(true)
			const { street, neighborhood, city, state, country, geoCoordinates } = await resolvePostalCode(
				address.postalCode
			)
			setAddress({
				...address,
				street,
				neighborhood,
				city,
				state,
				country,
				geoCoordinates
			})
			setIsLoading(false)
		} catch (e) {}
	}

	const submit = async () => {
		setAddressError('')
		try {
			await setNewAddress(address)
			navigate('FreightSelector')
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

	return (
		<Page title={PAGE_NAME}>
			<View
				topInset
				bottomInset
				className='min-h-[100vh] flex flex-col'>
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
								autoFocus={true}
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

						<>
							<View>
								<CustomInput
									label={t('addNewShippingAddress.frmStreet')}
									placeholder={''}
									value={address?.street || ''}
									onChange={e => handleAddressChange('street', e)}
								/>
							</View>
							<View className='flex gap-4'>
								<View className='w-1/2'>
									<CustomInput
										label={t('addNewShippingAddress.frmNumber')}
										placeholder={''}
										value={address?.number || ''}
										onChange={e => handleAddressChange('number', e)}
									/>
								</View>
								<View className='w-1/2'>
									<CustomInput
										label={t('addNewShippingAddress.frmComplement')}
										placeholder={''}
										value={address?.complement || ''}
										onChange={e => handleAddressChange('complement', e)}
									/>
								</View>
							</View>
							<View>
								<CustomInput
									label={t('addNewShippingAddress.frmNeighborhood')}
									placeholder={''}
									value={address.neighborhood || ''}
									onChange={e => handleAddressChange('neighborhood', e)}
								/>
							</View>
							<View className='flex gap-4'>
								<View className='w-1/2'>
									<CustomInput
										label={t('addNewShippingAddress.frmCity')}
										placeholder={''}
										value={address.city || ''}
										onChange={e => handleAddressChange('city', e)}
									/>
								</View>
								<View className='w-1/2'>
									<CustomInput
										label={t('addNewShippingAddress.frmState')}
										placeholder={''}
										value={address?.state || ''}
										onChange={e => handleAddressChange('state', e)}
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
