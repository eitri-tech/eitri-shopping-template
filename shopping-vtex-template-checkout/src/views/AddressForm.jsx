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
import { useRef, useState } from 'react'
import Alert from '../components/Alert'

function PostalCodeInput({ value, onChange, onSubmit, isLoading, t }) {
	return (
		<View className='flex gap-2 items-end'>
			<CustomInput
				label={t('addNewShippingAddress.txtCalculate')}
				inputMode='numeric'
				placeholder='12345-678'
				className='w-[70%]'
				value={value}
				onChange={onChange}
				autoFocus={true}
				variant='mask'
				mask='99999-999'
				disabled={isLoading}
			/>
			<CustomButton
				className='w-[30%]'
				label={
					isLoading
						? t('addNewShippingAddress.loading') || 'Aguarde...'
						: t('addNewShippingAddress.ok') || 'OK'
				}
				onPress={onSubmit}
				display='flex'
				justifyContent='center'
				disabled={isLoading || !value}
				isLoading={isLoading}
			/>
		</View>
	)
}

function AddressFields({ address, handleAddressChange, t, numberInputRef, touched, errors, onBlur }) {
	return (
		<>
			<View>
				<CustomInput
					label={t('addNewShippingAddress.frmStreet')}
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
						label={t('addNewShippingAddress.frmNumber')}
						placeholder={''}
						value={address?.number || ''}
						onChange={e => handleAddressChange('number', e)}
						inputRef={numberInputRef}
						className={errors.number && touched.number ? 'border-red-500' : ''}
						onBlur={() => onBlur('number')}
					/>
					{errors.number && touched.number && <Text className='text-xs text-red-500'>{errors.number}</Text>}
				</View>
				<View className='w-1/2'>
					<CustomInput
						label={t('addNewShippingAddress.frmComplement')}
						placeholder={''}
						value={address?.complement || ''}
						onChange={e => handleAddressChange('complement', e)}
						onBlur={() => onBlur('complement')}
					/>
				</View>
			</View>
			<View>
				<CustomInput
					label={t('addNewShippingAddress.frmNeighborhood')}
					placeholder={''}
					value={address.neighborhood || ''}
					onChange={e => handleAddressChange('neighborhood', e)}
					className={errors.neighborhood && touched.neighborhood ? 'border-red-500' : ''}
					onBlur={() => onBlur('neighborhood')}
				/>
				{errors.neighborhood && touched.neighborhood && (
					<Text className='text-xs text-red-500'>{errors.neighborhood}</Text>
				)}
			</View>
			<View className='flex gap-4'>
				<View className='w-1/2'>
					<CustomInput
						label={t('addNewShippingAddress.frmCity')}
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
						label={t('addNewShippingAddress.frmState')}
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
					placeholder={t('addNewShippingAddress.frmReceiveName')}
					label={t('addNewShippingAddress.frmReceiveName')}
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
		postalCode: !address.postalCode ? t('addNewShippingAddress.errorPostalCode') : '',
		street: !address.street ? t('addNewShippingAddress.errorStreet') : '',
		neighborhood: !address.neighborhood ? t('addNewShippingAddress.errorNeighborhood') : '',
		city: !address.city ? t('addNewShippingAddress.errorCity') : '',
		state: !address.state ? t('addNewShippingAddress.errorState') : '',
		receiverName: !address.receiverName ? t('addNewShippingAddress.errorReceiverName') : '',
		number: !address.number ? t('addNewShippingAddress.errorNumber') : ''
	}
}

export default function AddressForm(props) {
	const PAGE_NAME = 'Checkout - Cadastro de Endereço'

	const { cart, setNewAddress, cartIsLoading } = useLocalShoppingCart()
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

	const numberInputRef = useRef(null)
	const [touched, setTouched] = useState({})
	const errors = validateAddress(address, t)

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
			// Foco no campo número após buscar o CEP
			setTimeout(() => {
				if (numberInputRef.current) {
					numberInputRef.current.focus()
				}
			}, 100)
		} catch (e) {
			setIsLoading(false)
		}
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

	const onBlur = field => {
		setTouched(prev => ({ ...prev, [field]: true }))
	}

	const isValidAddress = () => {
		return !Object.values(validateAddress(address, t)).some(Boolean)
	}

	return (
		<Page title={PAGE_NAME}>
			<View
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
					isLoading={cartIsLoading}
				/>
				{/* Feedback visual de erro com Alert */}
				<Alert
					message={addressError}
					type='negative'
					duration={3}
					show={!!addressError}
					onDismiss={() => setAddressError('')}
				/>
				<View className='flex-1 flex flex-col p-4'>
					<View className='flex flex-col gap-4 flex-1'>
						{/* Remover texto de erro antigo */}
						<PostalCodeInput
							value={address?.postalCode}
							onChange={onChangePostalCodeInput}
							onSubmit={submitZipCode}
							isLoading={isLoading}
							t={t}
						/>
						{isLoading && (
							<View>
								<Text>{t('addNewShippingAddress.loading') || 'Aguarde...'}</Text>
							</View>
						)}
						<AddressFields
							address={address}
							handleAddressChange={handleAddressChange}
							t={t}
							numberInputRef={numberInputRef}
							touched={touched}
							errors={errors}
							onBlur={onBlur}
						/>
					</View>
				</View>
				<View className='p-4'>
					<CustomButton
						width='100%'
						marginTop='large'
						label={
							isLoading
								? t('addNewShippingAddress.loading') || 'Aguarde...'
								: t('addNewShippingAddress.labelButton')
						}
						fontSize='medium'
						disabled={!isValidAddress() || isLoading}
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
				</View>
			</View>
		</Page>
	)
}
