import { HeaderContentWrapper, HeaderReturn, cartShippingResolver } from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { navigate } from '../services/navigationService'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import CardSelector from '../components/CardSelector/CardSelector'

export default function ShippingMethod(props) {
	const { cart, setFreight } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)

	const shippingOptions = cartShippingResolver(cart)

	const goToFreightSelector = () => {
		navigate('FreightSelector', {}, false)
	}

	const goToAddressSelector = () => {
		navigate('AddressSelector', {}, false)
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

	const pickUpOptions = shippingOptions?.options?.filter(opt => opt.isPickupInPoint)
	const deliveryOptions = shippingOptions?.options?.filter(opt => !opt.isPickupInPoint)

	const currentOrFirstPickUpOption = pickUpOptions?.find(p => p.isCurrent) || pickUpOptions?.[0]

	return (
		<Page>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen={true}
				isLoading={isLoading}
			/>

			<View className='p-4'>
				<Text className='text-xl font-bold mb-4'>Como você prefere receber seu produto?</Text>
				{deliveryOptions?.length > 0 && (
					<CardSelector
						mainTitle={'Enviar para o meu endereço'}
						mainClickHandler={goToFreightSelector}
						secondaryActionHandler={goToAddressSelector}
						secondaryActionTitle={'Trocar endereço de entrega'}>
						<Text className='text text-base-content/70'>{`${shippingOptions.address.street}, ${shippingOptions.address.number || ''} ${shippingOptions.address.complement || ''}`}</Text>
						<Text className='text text-base-content/70'>{`${shippingOptions.address.neighborhood} - ${shippingOptions.address.city} - ${shippingOptions.address.state}`}</Text>
						<Text className='text text-base-content/70'>{`CEP: ${shippingOptions.address.postalCode}`}</Text>
					</CardSelector>
				)}

				{currentOrFirstPickUpOption && (
					<CardSelector
						mainTitle={currentOrFirstPickUpOption.label}
						mainClickHandler={() => onSelectFreightOption(currentOrFirstPickUpOption)}
						secondaryActionHandler={() => navigate('PickupSelector')}
						secondaryActionTitle={'Retirar em outra loja'}>
						<Text className='text text-base-content/70'>{`${currentOrFirstPickUpOption.address.street}, ${currentOrFirstPickUpOption.address.number} ${currentOrFirstPickUpOption.address.complement}`}</Text>
						<Text className='text text-base-content/70'>{`${currentOrFirstPickUpOption.address.neighborhood} - ${currentOrFirstPickUpOption.address.city} - ${currentOrFirstPickUpOption.address.state}`}</Text>
						<Text className='text text-base-content/70'>{`CEP: ${currentOrFirstPickUpOption.address.postalCode}`}</Text>
					</CardSelector>
				)}
			</View>
		</Page>
	)
}
