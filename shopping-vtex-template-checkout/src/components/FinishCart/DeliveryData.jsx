import SimpleCard from '../Card/SimpleCard'
import iconTruck from '../../assets/images/truck.svg'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { getShippingAddress } from '../../utils/getShippingAddress'

export default function DeliveryData(props) {
	const { onPress } = props
	const { cart } = useLocalShoppingCart()

	const { t } = useTranslation()

	const shippingAddress = getShippingAddress(cart)

	return (
		<SimpleCard
			isFilled={!!shippingAddress}
			onPress={onPress}
			title={shippingAddress?.isPickUp ? t('deliveryData.txtWithdrawal') : t('deliveryData.txtDelivery')}
			icon={iconTruck}>
			{shippingAddress?.isPickUp ? (
				<Text className='text-xs'>{shippingAddress?.formattedAddress}</Text>
			) : (
				<>
					{cart?.clientProfileData?.firstName && shippingAddress && (
						<Text className='mb-1 text-xs'>
							{`${cart?.clientProfileData?.firstName} ${cart?.clientProfileData?.lastName}`}
						</Text>
					)}
					<View className='flex flex-col gap-1'>
						<Text className='text-xs text-neutral-900'>
							{`${shippingAddress?.street}, ${
								shippingAddress?.number === null
									? t('deliveryData.txtNoNumber')
									: shippingAddress?.number
							}${shippingAddress?.complement ? ` - ${shippingAddress?.complement}` : ''}`}
						</Text>
						<Text className='text-xs text-neutral-900'>
							{`${shippingAddress?.neighborhood}, ${shippingAddress?.city} - ${shippingAddress?.state}`}
						</Text>
						<Text className='text-xs text-neutral-900'>{`${shippingAddress?.postalCode}`}</Text>
						{!shippingAddress?.number && (
							<View className='mt-2 flex flex-row gap-1'>
								<Text className='text-xs text-red-700'>{t('deliveryData.txtAlert')}</Text>
							</View>
						)}
					</View>
				</>
			)}
		</SimpleCard>
	)
}
