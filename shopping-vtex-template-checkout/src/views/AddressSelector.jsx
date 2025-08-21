import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	HeaderReturn,
	HeaderContentWrapper,
	HeaderText,
	BottomInset
} from 'eitri-shopping-montreal-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import { Page, View, Text } from 'eitri-luminus'
import { useState, useEffect } from 'react'
import DeliveryAddressList from '../components/AddressSelector/DeliveryAddressList'
import { navigate } from '../services/navigationService'

export default function AddressSelector(props) {
	const { cart, setShippingAddress } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [isAddressLoading, setIsAddressLoading] = useState(false)

	const PAGE = 'Checkout - Seleção de Endereço'

	useEffect(() => {
		if (cart?.shippingData?.availableAddresses?.length > 0) {
			sendPageView(PAGE)
		} else {
			handleAddNewAddress()
		}
	}, [])

	const handleAddressSelect = async address => {
		setIsAddressLoading(true)
		try {
			const currentAddress = cart?.shippingData?.address
			if (currentAddress?.addressId === address?.addressId) {
				console.log('Address already selected')
				return
			}
			await setShippingAddress(address)
		} catch (error) {
			console.error('Error selecting address:', error)
		} finally {
			setIsAddressLoading(false)
		}
	}

	const handleAddNewAddress = () => {
		navigate('AddressForm', {}, true)
	}

	const getAddresses = () => {
		if (cart?.shippingData?.availableAddresses) {
			return cart.shippingData.availableAddresses
				.filter(a => a.addressType === 'residential')
				.map(address => {
					return {
						...address
					}
				})
				.sort((a, b) => {
					return a.street > b.street ? 1 : -1
				})
		}
		return []
	}

	const handleContinue = async () => {
		if (!cart?.shippingData?.address) return

		await navigate('FreightSelector', {}, true)
	}

	const availableAddresses = getAddresses()

	return (
		<Page title={PAGE}>
			<View className='min-h-[100vh] flex flex-col'>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('addNewShippingAddress.title')} />
				</HeaderContentWrapper>

				<View className='flex-1 flex flex-col p-4'>
					<View className={`w-full`}>
						<View className='flex flex-col gap-1 mb-4'>
							<Text className='text-lg font-bold text-base-content'>
								{t('addressSelector.subtitle', 'Selecione um endereço para entrega')}
							</Text>
						</View>

						<DeliveryAddressList
							addresses={availableAddresses}
							selectedAddress={cart?.shippingData?.address}
							onAddressSelect={handleAddressSelect}
						/>

						<View className='mt-4'>
							<CustomButton
								outlined
								onClick={handleAddNewAddress}
								label={t('addressSelector.addNewAddress', 'Adicionar Novo Endereço')}
							/>
						</View>
					</View>
				</View>

				<View className='p-4'>
					<CustomButton
						width='100%'
						label={t('addNewShippingAddress.labelButton')}
						fontSize='medium'
						disabled={!cart?.shippingData?.address || isAddressLoading}
						onPress={handleContinue}
					/>
					<BottomInset />
				</View>
			</View>
		</Page>
	)
}
