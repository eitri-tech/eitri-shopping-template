import { Text, View } from 'eitri-luminus'
import { useLocalShoppingCart } from '../../../../providers/LocalCart'
import { useEffect, useState } from 'react'
import { resolvePostalCode } from '../../../../services/freigthService'
import { CustomInput } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'

export default function CreditCardBillingAddress() {
	const { cart, cardInfo, setCardInfo } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [useShippingAddress, setUseShippingAddress] = useState(true)

	useEffect(() => {
		const userAddress = cart?.shippingData?.address
		if (userAddress && userAddress?.addressType === 'residential') {
			setCardInfo({ ...cardInfo, address: userAddress })
		}
	}, [])

	const handlePostalCodeChange = async e => {
		const value = e.target.value

		if (!/^\d{5}-?\d{3}$/.test(value)) {
			handleAddressChange(e)
			return
		}

		try {
			const result = await resolvePostalCode(value)
			const { street, neighborhood, city, state, country } = result
			const address = {
				addressId: null,
				addressType: null,
				city: city,
				complement: '',
				country: country,
				neighborhood: neighborhood,
				number: '',
				postalCode: value,
				reference: '',
				state: state,
				street: street
			}

			setCardInfo({ ...cardInfo, addressId: null, address })
		} catch (e) {
			console.error('Error ao carregar endereço pelo CEP:', e)
		}
	}

	const handleAddressChange = (field, e) => {
		const value = e.target.value
		setCardInfo(prev => ({
			...prev,
			address: {
				...prev.address,
				[field]: value
			}
		}))
	}

	const onChangeBillingAddressCheckbox = async checked => {
		setUseShippingAddress(checked)
		if (checked) {
			const userAddress = cart?.shippingData?.address
			if (userAddress) {
				setCardInfo({ ...cardInfo, address: null, addressId: userAddress.addressId })
			}
		} else {
			setCardInfo({ ...cardInfo, address: null, addressId: null })
		}
	}

	const getShippingAddressLabel = () => {
		if (cardInfo) {
			return `${cardInfo.address?.street}, ${cardInfo.address?.number} - ${cardInfo.address?.neighborhood}, ${cardInfo.address?.city}`
		}
		return t('creditCardBillingAddress.shippingAddress', 'endereço de entrega')
	}

	return (
		<View className='flex flex-col gap-2 mt-2'>
			<Text className='text-sm font-bold'>
				{t('creditCardBillingAddress.title', 'Endereço de cobrança')}
			</Text>

			<View className='flex flex-row items-center gap-2'>
				<Checkbox
					id='useShippingAddress'
					className='checkbox-sm w-4 h-4'
					checked={useShippingAddress}
					onChange={e => onChangeBillingAddressCheckbox(e.target.checked)}
				/>

				<Text
					htmlFor='useShippingAddress'
					className='text-sm cursor-pointer'>
					{`${t('creditCardBillingAddress.sameAs', 'O endereço da fatura é')} ${getShippingAddressLabel()}`}
				</Text>
			</View>

			{!useShippingAddress && (
				<>
					<CustomInput
						label={t('creditCardBillingAddress.zipCode', 'CEP')}
						value={cardInfo?.address?.postalCode}
						inputMode='numeric'
						variant='mask'
						mask='99999-999'
						onChange={e => handlePostalCodeChange(e)}
					/>

					<CustomInput
						label={t('creditCardBillingAddress.street', 'Rua')}
						value={cardInfo?.address?.street}
						onChange={value => handleAddressChange('street', value)}
					/>

					<View className='flex flex-row gap-4'>
						<CustomInput
							label={t('creditCardBillingAddress.number', 'Número')}
							value={cardInfo?.address?.number}
							onChange={value => handleAddressChange('number', value)}
						/>
						<CustomInput
							label={t('creditCardBillingAddress.complement', 'Complemento')}
							value={cardInfo?.address?.complement}
							onChange={value => handleAddressChange('complement', value)}
						/>
					</View>

					<CustomInput
						label={t('creditCardBillingAddress.neighborhood', 'Bairro')}
						value={cardInfo?.address?.neighborhood}
						onChange={value => handleAddressChange('neighborhood', value)}
					/>

					<View className='flex flex-row gap-4'>
						<CustomInput
							label={t('creditCardBillingAddress.city', 'Cidade')}
							value={cardInfo?.address?.city}
							onChange={value => handleAddressChange('city', value)}
						/>
						<CustomInput
							label={t('creditCardBillingAddress.state', 'Estado')}
							value={cardInfo?.address?.state}
							onChange={value => handleAddressChange('state', value)}
						/>
					</View>
				</>
			)}
		</View>
	)
}
