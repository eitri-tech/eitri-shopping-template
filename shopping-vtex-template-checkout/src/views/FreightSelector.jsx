import { useLocalShoppingCart } from '../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { Page, Radio, Text, View } from 'eitri-luminus'
import { navigate } from '../services/navigationService'
import { useState } from 'react'
import { cartShippingResolver } from 'shopping-vtex-template-shared'
import FixedBottom from '../components/FixedBottom/FixedBottom'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { HeaderContentWrapper, HeaderReturn, CustomButton } from 'shopping-vtex-template-shared'

export default function FreightSelector(props) {
	const { cart, setFreight } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)

	const { t } = useTranslation()

	const submit = async () => {
		navigate('PaymentData', {}, true)
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
				<Text className='text-xl font-bold'>Como deseja receber seu produto?</Text>

				<Text>
					{`Receber em ${shippingOptions.address.street}, ${shippingOptions.address.number || ''} ${shippingOptions.address.complement || ''}`}
				</Text>

				<View className='bg-white rounded shadow-sm border border-gray-300 p-4 w-full flex flex-col gap-3'>
					{deliveryOptions.map((item, index) => (
						<View
							key={index}
							className='flex flex-row items-center w-fullr'
							onClick={() => onSelectFreightOption(item)}>
							<Radio
								className='radio-primary'
								checked={item.isCurrent}
								name='freight-option-delivery'
								value={item?.label}
								onChange={() => onSelectFreightOption(item)}
							/>
							<View className='w-full flex flex-col flex-1 ml-3'>
								<Text className='font-bold'>{item?.shippingEstimate}</Text>
								<Text className='text-xs text-neutral-500'>{item?.label}</Text>
							</View>
							<View className='flex items-center'>
								<Text className={`font-semibold ${item.price === 'Grátis' ? 'text-green-600' : ''}`}>
									{item?.price}
								</Text>
							</View>
						</View>
					))}
				</View>
			</View>

			<FixedBottom className='flex flex-col align-center gap-4'>
				<CustomButton
					disabled={!deliveryOptions?.some(item => item.isCurrent)}
					label={t('addNewShippingAddress.labelButton')}
					onClick={submit}
				/>
				<View onClick={() => navigate('AddressSelector', {}, true)}>
					<Text className='text-primary text-center font-bold block'>{'Alterar endereço de entrega'}</Text>
				</View>
			</FixedBottom>
		</Page>
	)
}
