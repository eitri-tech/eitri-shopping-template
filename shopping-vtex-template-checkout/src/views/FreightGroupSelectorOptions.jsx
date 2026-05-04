import { useState } from 'react'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { Page, Text, View } from 'eitri-luminus'
import { HeaderContentWrapper, HeaderReturn, BottomInset } from 'shopping-vtex-template-shared'
import CardSelector from '../components/CardSelector/CardSelector'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { navigate } from '../services/navigationService'

export default function FreightGroupSelectorOptions(props) {
	const group = props?.location?.state?.group

	const { cart, setFreight } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)

	const { t } = useTranslation()

	const submit = async () => {
		navigate('PaymentData', {}, true)
	}

	const onSelectFreightOption = async (selectedSla, items) => {
		try {
			setIsLoading(true)
			const slas = items.map(item => ({
				itemIndex: item.itemIndex,
				selectedSla: selectedSla.id,
				selectedDeliveryChannel: selectedSla.isPickupInPoint ? 'pickup-in-point' : 'delivery'
			}))

			const payload = {
				clearAddressIfPostalCodeNotFound: false,
				logisticsInfo: slas,
				selectedAddresses: cart.shippingData.selectedAddresses
			}

			await setFreight(payload)

			Eitri.navigation.back()
		} catch (error) {
			console.error('Error on select freight option', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Page title={t('checkoutPages.freightDelivery', 'Checkout - Frete e Entrega')}>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className='flex-1 flex flex-col p-4 gap-4'>
				<Text className='text-xl font-bold'>
					{t('freightGroupSelectorOptions.title', 'Escolha como quer receber esses produtos')}
				</Text>

				<View className='flex flex-row gap-4'>
					{group?.items?.map((product, index) => (
						<View key={product?.itemId ? `${product.itemId}-${index}` : index}>
							<Image
								src={product.imageUrl}
								className='w-12 h-12 rounded-full object-contain'
							/>
						</View>
					))}
				</View>
				<View className='flex flex-col'>
					{group?.slas?.map((sla, index) => {
						const label = sla.isPickupInPoint
							? `${t('freightGroupSelectorOptions.pickupAtStore', 'Retire na loja')} ${sla.pickupStoreInfo.friendlyName}`
							: `${sla.formatedShippingEstimate}`

						return (
							<CardSelector
								key={label ? `${label}-${index}` : index}
								mainTitle={label}
								mainClickHandler={() => onSelectFreightOption(sla, group.items)}
								secondaryActionTitle={sla.formatedShippingEstimate}>
								{/*<Text className='text text-base-content/70'>{`${option.address.street}, ${option.address.number} ${option.address.complement}`}</Text>*/}
								{/*<Text className='text text-base-content/70'>{`${option.address.neighborhood} - ${option.address.city} - ${option.address.state}`}</Text>*/}
								{/*<Text className='text text-base-content/70'>{`CEP: ${option.address.postalCode}`}</Text>*/}
								{/*<Text*/}
								{/*	className={`text text-base-content/70 font-bold ${option.price === 'Grátis' ? 'text-green-600' : ''}`}>*/}
								{/*	{option.price}*/}
								{/*</Text>*/}
							</CardSelector>
						)
					})}
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
