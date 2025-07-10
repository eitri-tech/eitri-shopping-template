import Eitri from 'eitri-bifrost'
import { CustomButton, HeaderReturn, HeaderContentWrapper, HeaderText } from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import { Page, View, Text } from 'eitri-luminus'
import { useState, useEffect } from 'react'
import DeliveryAddressList from '../components/AddressSelector/DeliveryAddressList'

export default function AddressSelector(props) {
	const { cart, setShippingAddress } = useLocalShoppingCart()

	const [isAddressLoading, setIsAddressLoading] = useState(false)

	const { t } = useTranslation()

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
			await setShippingAddress(address)
		} catch (error) {
			console.error('Error selecting address:', error)
		} finally {
			setIsAddressLoading(false)
		}
	}

	const handleAddNewAddress = () => {
		Eitri.navigation.navigate({ path: '/AddressForm' })
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
		}
		return []
	}

	const availableAddresses = getAddresses()

	const handleContinue = async () => {
		if (!cart?.shippingData?.address) return

		await Eitri.navigation.navigate({ path: '/FreightSelector' })
	}

	return (
		<Page title={PAGE}>
			<View className='min-h-[100vh] flex flex-col'>
				<HeaderContentWrapper
					gap={16}
					scrollEffect={false}>
					<HeaderReturn />
					<HeaderText text={t('addNewShippingAddress.title')} />
				</HeaderContentWrapper>

				<View className='flex-1 flex flex-col p-4'>
					<View className={`w-full`}>
						<View className='flex flex-col gap-1 mb-4'>
							<Text className='text-lg font-bold text-base-content'>
								{t('addressSelector.title', 'Endereços de Entrega')}
							</Text>
							<Text className='text-sm text-base-content/70 mt-1'>
								{t('addressSelector.subtitle', 'Selecione um endereço para entrega')}
							</Text>
						</View>

						<DeliveryAddressList
							addresses={availableAddresses}
							selectedAddress={cart?.shippingData?.address}
							onAddressSelect={handleAddressSelect}
							onAddNewAddress={handleAddNewAddress}
							isLoading={isAddressLoading}
						/>
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
				</View>
			</View>
		</Page>
	)
}
