import Eitri from 'eitri-bifrost'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { trackScreenView } from '../services/Tracking'
import { useTranslation } from 'eitri-i18n'
import { Page, View } from 'eitri-luminus'
import { resolvePostalCode } from '../services/freigthService'
import { navigate, requestLogin } from '../services/navigationService'
import { useRef, useState } from 'react'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import FixedBottom from '../components/FixedBottom/FixedBottom'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	CustomButton,
	BottomInset,
	CustomInput
} from 'shopping-vtex-template-shared'

function PostalCodeInput({ value, onChange, isLoading, t, error, touched, onBlur }) {
	return (
		<View className='flex flex-col gap-1 w-full'>
			<View className='flex justify-between gap-2 w-full items-end'>
				<CustomInput
					label={t('addNewShippingAddress.txtZipCode', 'Insira seu CEP')}
					inputMode='numeric'
					value={value}
					onChange={onChange}
					autoFocus={true}
					disabled={isLoading}
					className={error && touched ? 'border-red-500' : ''}
					onBlur={onBlur}
				/>
			</View>
			{error && touched && <Text className='text-xs text-red-500 ml-1'>{error}</Text>}
		</View>
	)
}

function AddressFields({ address, handleAddressChange, t, touched, errors, onBlur }) {
	return (
		<>
			<View>
				<CustomInput
					label={t('addNewShippingAddress.frmStreet', 'Rua / Avenida')}
					placeholder={''}
					value={address?.street || ''}
					onChange={e => handleAddressChange('street', e)}
					className={errors.street && touched.street ? 'border-red-500' : ''}
					onBlur={() => onBlur('street')}
				/>
				{errors.street && touched.street && <Text className='text-xs text-red-500'>{errors.street}</Text>}
			</View>
			<View className='flex gap-4'>
				<View className='w-1/2'>
					<CustomInput
						label={t('addNewShippingAddress.frmNumber', 'Número')}
						placeholder={''}
						value={address?.number || ''}
						onChange={e => handleAddressChange('number', e)}
						className={errors.number && touched.number ? 'border-red-500' : ''}
						onBlur={() => onBlur('number')}
					/>
					{errors.number && touched.number && <Text className='text-xs text-red-500'>{errors.number}</Text>}
				</View>
				<View className='w-1/2'>
					<CustomInput
						label={t('addNewShippingAddress.frmComplement', 'Complemento')}
						placeholder={''}
						value={address?.complement || ''}
						onChange={e => handleAddressChange('complement', e)}
						onBlur={() => onBlur('complement')}
					/>
				</View>
			</View>
			<View>
				{/*<CustomInput*/}
				{/*	label={t('addNewShippingAddress.frmNeighborhood')}*/}
				{/*	placeholder={''}*/}
				{/*	value={address.neighborhood || ''}*/}
				{/*	onChange={e => handleAddressChange('neighborhood', e)}*/}
				{/*	className={errors.neighborhood && touched.neighborhood ? 'border-red-500' : ''}*/}
				{/*	onBlur={() => onBlur('neighborhood')}*/}
				{/*/>*/}
				{/*{errors.neighborhood && touched.neighborhood && (*/}
				{/*	<Text className='text-xs text-red-500'>{errors.neighborhood}</Text>*/}
				{/*)}*/}
			</View>
			<View className='flex gap-4'>
				<View className='w-1/2'>
					<CustomInput
						label={t('addNewShippingAddress.frmCity', 'Cidade')}
						placeholder={''}
						value={address.city || ''}
						onChange={e => handleAddressChange('city', e)}
						className={errors.city && touched.city ? 'border-red-500' : ''}
						onBlur={() => onBlur('city')}
					/>
					{errors.city && touched.city && <Text className='text-xs text-red-500'>{errors.city}</Text>}
				</View>
				<View className='w-1/2'>
					<CustomInput
						label={t('addNewShippingAddress.frmState', 'Estado')}
						placeholder={''}
						value={address?.state || ''}
						onChange={e => handleAddressChange('state', e)}
						className={errors.state && touched.state ? 'border-red-500' : ''}
						onBlur={() => onBlur('state')}
					/>
					{errors.state && touched.state && <Text className='text-xs text-red-500'>{errors.state}</Text>}
				</View>
			</View>
			<View>
				<CustomInput
					placeholder={t('addNewShippingAddress.frmReceiveName', 'Quem irá receber o pedido?')}
					label={t('addNewShippingAddress.frmReceiveName', 'Quem irá receber o pedido?')}
					value={address?.receiverName || ''}
					onChange={text => handleAddressChange('receiverName', text)}
					className={errors.receiverName && touched.receiverName ? 'border-red-500' : ''}
					onBlur={() => onBlur('receiverName')}
				/>
				{errors.receiverName && touched.receiverName && (
					<Text className='text-xs text-red-500'>{errors.receiverName}</Text>
				)}
			</View>
		</>
	)
}

function validateAddress(address, t) {
	return {
		street: !address.street ? t('addNewShippingAddress.errorStreet') : '',
		// neighborhood: !address.neighborhood ? t('addNewShippingAddress.errorNeighborhood') : '',
		city: !address.city ? t('addNewShippingAddress.errorCity') : '',
		state: !address.state ? t('addNewShippingAddress.errorState') : '',
		receiverName: !address.receiverName ? t('addNewShippingAddress.errorReceiverName') : '',
		number: !address.number ? t('addNewShippingAddress.errorNumber') : ''
	}
}

export default function AddressForm(props) {
	const PAGE_NAME = 'Checkout - Cadastro de Endereço'

	const { cart, cartIsLoading, setLogisticInfo, startCart } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [addressId, setAddressId] = useState(props.location?.state?.addressId)
	const [isLoading, setIsLoading] = useState(false)
	const [addressError, setAddressError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [address, setAddress] = useState({
		postalCode: '',
		street: '',
		neighborhood: '',
		city: '',
		state: '',
		country: 'USA',
		geoCoordinates: [],
		number: '',
		complement: '',
		reference: '',
		addressQuery: '',
		addressType: 'residential',
		receiverName: cart?.clientProfileData?.firstName
			? `${cart?.clientProfileData?.firstName} ${cart?.clientProfileData?.lastName}`
			: '',
		isDisposable: false
	})
	const [touched, setTouched] = useState({})

	useEffect(() => {
		trackScreenView(PAGE_NAME)
	}, [])

	useEffect(() => {
		if (addressId) {
			init(addressId)
		}
	}, [addressId])

	// useEffect(() => {
	// 	const postalCodeDigits = address?.postalCode?.replace(/\D/g, '') || ''
	//
	// 	if (postalCodeDigits.length === 8) {
	// 		submitZipCode(address?.postalCode)
	// 	}
	// }, [address?.postalCode])

	const errors = useMemo(() => validateAddress(address, t), [address, t])

	const init = async addressId => {
		try {
			if (!cart.canEditData) {
				await requestLogin()
				const newCart = await startCart()
				const _address = newCart?.shippingData?.selectedAddresses?.find(
					address => address.addressId === addressId
				)
				setAddress({
					...address,
					..._address
				})
			} else {
				const _address = cart?.shippingData?.selectedAddresses?.find(address => address.addressId === addressId)
				if (!_address && cart?.shippingData?.selectedAddresses?.[0]?.addressId) {
					setAddressId(cart.shippingData.selectedAddresses[0].addressId)
					return
				}
				setAddress({
					...address,
					..._address
				})
			}
		} catch (e) {
			Eitri.navigation.back()
		}
	}

	const handleAddressChange = useCallback((key, e) => {
		const { value } = e.target
		setAddress(prev => ({
			...prev,
			[key]: key === 'receiverName' ? value.replace(/[^a-zA-Z\s]/g, '') : value
		}))
	}, [])

	const onChangePostalCodeInput = async e => {
		const { value } = e.target
		setAddress({ ...address, postalCode: value })
	}

	const submitZipCode = async postalCode => {
		try {
			if (!postalCode) return
			setIsLoading(true)
			const { street, neighborhood, city, state, country, geoCoordinates } = await resolvePostalCode(postalCode)
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
			// Foco no campo número após buscar o CEP
			setTimeout(() => {
				document.getElementById('numberField')?.focus()
			}, 100)
		} catch (e) {
			setIsLoading(false)
		}
	}

	const submit = async () => {
		if (isSubmitting) return
		setIsSubmitting(true)
		setAddressError('')
		try {
			if (addressId) {
				const newSelectedAddresses = cart?.shippingData?.selectedAddresses?.map(selectedAddress => {
					if (selectedAddress.addressId === addressId) {
						return address
					}
					return selectedAddress
				})

				const payload = {
					logisticsInfo: cart?.shippingData?.logisticsInfo,
					clearAddressIfPostalCodeNotFound: false,
					selectedAddresses: newSelectedAddresses
				}
				await setLogisticInfo(payload)
			} else {
				const payload = {
					address,
					clearAddressIfPostalCodeNotFound: false
				}
				await setLogisticInfo(payload)
			}
			navigate('FreightResolver', {}, true)
		} catch (e) {
			if (e.response?.status === 400) {
				setAddressError(t('addNewShippingAddress.errorAddress', 'Endereço inválido, por favor verifique os dados'))
				console.error('Error on submit', e)
				return
			}
			setAddressError(t('addNewShippingAddress.errorDefault', 'Ocorreu um erro inesperado, tente novamente'))
			setTimeout(() => setAddressError(''), 8000)
		} finally {
			setIsSubmitting(false)
		}
	}

	const onBlur = field => {
		setTouched(prev => ({ ...prev, [field]: true }))
	}

	const isValidAddress = useMemo(() => {
		return !Object.values(errors).some(Boolean)
	}, [errors])

	return (
		<Page title={PAGE_NAME}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('addNewShippingAddress.title', 'Entrega')} />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen
				isLoading={cartIsLoading}
			/>

			<View className='flex flex-col gap-2 p-4 m-4 bg-white rounded shadow-sm border border-gray-300'>
				<View>
					<View className='mb-1'>
						<Text className='text-xs font-bold'>Country</Text>
					</View>
					<Select
						value={address?.country}
						className={'w-full rounded border-gray-300 border-solid border-2 focus:outline-none'}
						placeholder='Country'>
						<Select.Item value='AUS'>Australia</Select.Item>
						<Select.Item value='CAN'>Canada</Select.Item>
						<Select.Item value='CHN'>China</Select.Item>
						<Select.Item value='DOM'>Dominican Republic</Select.Item>
						<Select.Item value='HKG'>Hong Kong</Select.Item>
						<Select.Item value='JPN'>Japan</Select.Item>
						<Select.Item value='KOR'>Korea, Republic of</Select.Item>
						<Select.Item value='MEX'>Mexico</Select.Item>
						<Select.Item value='NZL'>New Zealand</Select.Item>
						<Select.Item value='PRI'>Puerto Rico</Select.Item>
						<Select.Item value='LCA'>Saint Lucia</Select.Item>
						<Select.Item value='TWN'>Taiwan</Select.Item>
						<Select.Item value='ARE'>United Arab Emirates</Select.Item>
						<Select.Item
							value='USA'
							selected=''>
							United States
						</Select.Item>
					</Select>
				</View>

				<PostalCodeInput
					value={address?.postalCode}
					onChange={onChangePostalCodeInput}
					onSubmit={submitZipCode}
					isLoading={isLoading}
					t={t}
					error={errors.postalCode}
					touched={touched.postalCode}
					onBlur={() => onBlur('postalCode')}
				/>
				{isLoading && (
					<View>
						<Text>{t('addNewShippingAddress.loading', 'Aguarde...')}</Text>
					</View>
				)}
				<AddressFields
					address={address}
					handleAddressChange={handleAddressChange}
					t={t}
					touched={touched}
					errors={errors}
					onBlur={onBlur}
				/>
			</View>

			{addressError && (
				<View className={'p-4'}>
					<View className='bg-red-100 border border-red-400 px-4 py-3 rounded'>
						<Text className='text-red-700 font-medium'>{addressError}</Text>
					</View>
				</View>
			)}

			<FixedBottom
				className='flex flex-col align-center gap-4'
				offSetHeight={77}>
				<CustomButton
					width='100%'
					marginTop='large'
					label={
						isLoading
							? t('addNewShippingAddress.loading', 'Aguarde...')
							: t('addNewShippingAddress.labelButton', 'Continuar')
					}
					fontSize='medium'
					disabled={!isValidAddress || isLoading}
					onPress={() => {
						// Marca todos os campos como tocados ao tentar submeter
						setTouched({
							postalCode: true,
							street: true,
							neighborhood: true,
							city: true,
							state: true,
							receiverName: true,
							number: true
						})
						submit()
					}}
					isLoading={isLoading}
				/>
			</FixedBottom>

			<BottomInset />
		</Page>
	)
}
