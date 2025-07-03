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
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import { Page, View, Text } from 'eitri-luminus'
import AddressTypeTabs from '../components/AddressSelector/AddressTypeTabs'
import PickupPointList from '../components/AddressSelector/PickupPointList'
import { navigate } from '../services/flowControl'

export default function FreightSelector(props) {
	const { cart, setFreight } = useLocalShoppingCart()

	const [adressError, setAddressError] = useState('')
	const [selectedTab, setSelectedTab] = useState('delivery') // 'delivery' or 'pickup'
	const [isLoading, setIsLoading] = useState(false)

	const { t } = useTranslation()

	const submit = async () => {
		navigate('FreightSelector', cart)
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
						{adressError && <Text className='mt-2 text-red-700'>{adressError}</Text>}

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
