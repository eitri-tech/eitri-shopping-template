import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	HeaderReturn,
	HeaderContentWrapper,
	HeaderText,
	cartShippingResolver
} from 'shopping-vtex-template-shared'
import ShippingMethods from '../components/Methods/ShippingMethods'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { Page, View, Text } from 'eitri-luminus'
import AddressTypeTabs from '../components/AddressSelector/AddressTypeTabs'
import PickupPointList from '../components/AddressSelector/PickupPointList'
import { navigate } from '../services/navigationService'
import { useState, useEffect } from 'react'

export default function FreightSelector(props) {
	const { cart, setFreight } = useLocalShoppingCart()

	const [selectedTab, setSelectedTab] = useState('delivery') // 'delivery' or 'pickup'
	const [isLoading, setIsLoading] = useState(false)

	const { t } = useTranslation()

	// Determina automaticamente qual aba abrir baseada na opção já selecionada
	useEffect(() => {
		if (!cart?.shippingData?.address) {
			navigate('AddressSelector', {}, true)
			return
		}

		if (!cart?.shippingData?.address?.number) {
			navigate('AddressForm', { addressId: cart?.shippingData?.address?.addressId }, true)
			return
		}

		if (cart?.shippingData?.logisticsInfo?.[0]) {
			const firstLogisticInfo = cart.shippingData.logisticsInfo[0]
			const isPickup = firstLogisticInfo.selectedDeliveryChannel === 'pickup-in-point'

			// Se há uma opção selecionada, abre na aba correspondente
			if (firstLogisticInfo.selectedSla) {
				setSelectedTab(isPickup ? 'pickup' : 'delivery')
			}
		}
	}, [cart])

	const submit = async () => {
		navigate('FinishCart')
	}

	const onSelectFreightOption = async freightOption => {
		try {
			setIsLoading(true)
			const slas = freightOption.slas.map(sla => ({
				itemIndex: sla.itemIndex,
				selectedSla: sla.id,
				selectedDeliveryChannel: sla.isPickupInPoint ? 'pickup-in-point' : 'delivery'
			}))

			const payload = {
				clearAddressIfPostalCodeNotFound: false,
				logisticsInfo: slas,
				selectedAddresses: cart.shippingData.selectedAddresses
			}
			await setFreight(payload)
		} catch (error) {
			console.error('Error on select freight option', error)
		} finally {
			setIsLoading(false)
		}
	}

	const shippingOptions = cartShippingResolver(cart)
	const deliveryOptions = shippingOptions?.options?.filter(opt => !opt.isPickupInPoint)
	const pickUpOptions = shippingOptions?.options?.filter(opt => opt.isPickupInPoint)

	return (
		<Page title='Checkout - Frete e Entrega'>
			<View className='min-h-[100vh] flex flex-col'>
				<HeaderContentWrapper
					gap={16}
					scrollEffect={false}>
					<HeaderReturn />
					<HeaderText text={t('freightSelector.title', 'Frete e Entrega')} />
				</HeaderContentWrapper>

				<View className='flex-1 flex flex-col p-4'>
					<View className='flex flex-col gap-4 flex-1'>
						<AddressTypeTabs
							selectedTab={selectedTab}
							onTabChange={setSelectedTab}
						/>

						{selectedTab === 'pickup' ? (
							<PickupPointList
								onSelectFreightOption={onSelectFreightOption}
								options={pickUpOptions}
								loading={isLoading}
							/>
						) : (
							<ShippingMethods
								onSelectFreightOption={onSelectFreightOption}
								options={deliveryOptions}
								loading={isLoading}
							/>
						)}

						<View className='p-4'>
							<CustomButton
								width='100%'
								label={'Alterar endereço de entrega'}
								outlined
								onPress={() => navigate('AddressSelector')}
							/>
						</View>
					</View>
				</View>

				<View className='p-4'>
					<CustomButton
						width='100%'
						marginTop='large'
						label={t('addNewShippingAddress.labelButton')}
						fontSize='medium'
						onPress={submit}
					/>
				</View>
			</View>
		</Page>
	)
}
