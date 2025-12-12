import { useLocalShoppingCart } from '../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { Page, Radio, Text, View } from 'eitri-luminus'
import { navigate } from '../services/navigationService'
import { useState } from 'react'
import { FaChevronRight } from 'react-icons/fa'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { HeaderContentWrapper, HeaderReturn, BottomInset } from 'shopping-vtex-template-shared'
import CardSelector from '../components/CardSelector/CardSelector'
import Eitri from 'eitri-bifrost'

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
		<Page title='Checkout - Frete e Entrega'>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className='flex-1 flex flex-col p-4 gap-4'>
				<Text className='text-xl font-bold'>Escolha como quer receber esses produtos</Text>

				<View className='flex flex-row gap-4'>
					{group?.items?.map(product => (
						<View>
							<Image
								src={product.imageUrl}
								className='w-12 h-12 rounded-full object-contain'
							/>
						</View>
					))}
				</View>
				<View className='flex flex-col'>
					{group?.slas?.map(sla => {
						const label = sla.isPickupInPoint
							? `Retire na loja ${sla.pickupStoreInfo.friendlyName}`
							: `${sla.formatedShippingEstimate}`

						return (
							<CardSelector
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
