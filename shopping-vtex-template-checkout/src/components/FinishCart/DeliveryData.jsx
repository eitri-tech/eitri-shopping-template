import SimpleCard from '../Card/SimpleCard'
import iconTruck from '../../assets/images/truck.svg'
import { useTranslation } from 'eitri-i18n'

export default function DeliveryData(props) {
	const { onPress, address, clientProfileData, shipping } = props
	const { street, number, complement, neighborhood, city, state, postalCode } = address ?? {}
	const { firstName, lastName } = clientProfileData ?? {}
	const [isPickUp, setIsPickUp] = useState(false)
	const [pickupAddress, setPickupAddress] = useState('')

	const { t } = useTranslation()
	
	useEffect(() => {
		const pickUpOption = shipping?.options?.find(option => option.isPickupInPoint && option.isCurrent)

		if (pickUpOption) {
			setIsPickUp(true)
			setPickupAddress(pickUpOption?.slas?.[0].pickupStoreInfo?.friendlyName)
		}
	}, [shipping])

	const isAddressFilled = address => {
		return address && address.street && address.neighborhood && address.city && address.state && address.postalCode
	}

	return (
		<SimpleCard
			isFilled={isAddressFilled(address)}
			onPress={onPress}
			title={isPickUp ? t('deliveryData.txtWithdrawal') : t('deliveryData.txtDelivery')}
			icon={iconTruck}>
			{isPickUp ? (
				<Text className="text-xs">{pickupAddress}</Text>
			) : (
				<>
					{firstName && isAddressFilled(address) && (
						<Text
							marginBottom='nano'
							fontSize='extra-small'>{`${firstName} ${lastName}`}</Text>
					)}
					<View
						direction='column'
						display='flex'
						gap={3}>
						<Text
							fontSize='extra-small'
							color={'neutral-900'}>
							{`${street}, ${number === null ? t('deliveryData.txtNoNumber') : number}${
								complement ? ` - ${complement}` : ''
							}`}
						</Text>
						<Text
							fontSize='extra-small'
							color='neutral-900'>{`${neighborhood}, ${city} - ${state}`}</Text>
						<Text
							fontSize='extra-small'
							color='neutral-900'>{`${postalCode}`}</Text>
						{!number && (
							<View
								direction='row'
								display='flex'
								gap={4}
								marginTop='small'>
								<Text
									fontSize='extra-small'
									color={'negative-700'}>
									{t('deliveryData.txtAlert')}
								</Text>
							</View>
						)}
					</View>
				</>
			)}
		</SimpleCard>
	)
}
