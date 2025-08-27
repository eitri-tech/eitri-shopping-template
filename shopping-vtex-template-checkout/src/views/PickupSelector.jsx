import { useLocalShoppingCart } from '../providers/LocalCart'
import { trackScreenView } from '../services/Tracking'
import { Page, Text, View } from 'eitri-luminus'
import { useEffect, useState } from 'react'
import { navigate } from '../services/navigationService'
import { cartShippingResolver } from 'shopping-vtex-template-shared'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import CardSelector from '../components/CardSelector/CardSelector'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset } from 'shopping-vtex-template-shared'

export default function PickupSelector(props) {
	const { cart, setFreight } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)
	const [seeMore, setSeeMore] = useState(false)

	const PAGE = 'Checkout - Seleção de Endereço'

	useEffect(() => {
		if (cart?.shippingData?.availableAddresses?.length > 0) {
			trackScreenView(PAGE)
		} else {
			handleAddNewAddress()
		}
	}, [])

	const handleAddNewAddress = () => {
		navigate('AddressForm', {}, true)
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
			navigate('PaymentData')
		} catch (error) {
			console.error('Error on select freight option', error)
		} finally {
			setIsLoading(false)
		}
	}

	const shippingOptions = cartShippingResolver(cart)
	const pickUpOptions = shippingOptions?.options?.filter(opt => opt.isPickupInPoint)

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Retirada'} />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className='flex-1 flex flex-col p-4'>
				<View>
					<Text className='text-lg font-bold text-base-content'>
						{'Em qual loja deseja retirar seu produto?'}
					</Text>
				</View>

				{pickUpOptions?.slice(0, seeMore ? Infinity : 3).map(option => (
					<CardSelector
						mainTitle={option.label}
						mainClickHandler={() => onSelectFreightOption(option)}
						secondaryActionTitle={option.shippingEstimate}>
						<Text className='text text-base-content/70'>{`${option.address.street}, ${option.address.number} ${option.address.complement}`}</Text>
						<Text className='text text-base-content/70'>{`${option.address.neighborhood} - ${option.address.city} - ${option.address.state}`}</Text>
						<Text className='text text-base-content/70'>{`CEP: ${option.address.postalCode}`}</Text>
						<Text
							className={`text text-base-content/70 font-bold ${option.price === 'Grátis' ? 'text-green-600' : ''}`}>
							{option.price}
						</Text>
					</CardSelector>
				))}

				<View
					onClick={() => setSeeMore(!seeMore)}
					className='flex items-center justify-center mt-4 text-primary font-bold'>
					<Text>{seeMore ? 'Ver menos' : 'Ver mais'}</Text>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
