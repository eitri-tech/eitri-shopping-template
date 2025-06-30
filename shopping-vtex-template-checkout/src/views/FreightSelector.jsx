import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	Loading,
	HeaderReturn,
	HeaderContentWrapper,
	HeaderText,
	CustomInput,
	cartShippingResolver
} from 'shopping-vtex-template-shared'
import ShippingMethods from '../components/Methods/ShippingMethods'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import { Page, View, Text, Button } from 'eitri-luminus'
import { useState } from 'react'
import AddressTypeTabs from '../components/AddressSelector/AddressTypeTabs'
import PickupPointList from '../components/AddressSelector/PickupPointList'

export default function FreightSelector(props) {
	const { cart, updateCartFreight, updateCartAddress, setShippingAddress } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)
	const [hasCartError, setHasCartError] = useState(false)
	const [addressFound, setAddressFound] = useState(null)
	const [adressError, setAddressError] = useState('')
	const [seeCompactedMode, setSeeCompactedMode] = useState(true)
	const [selectedTab, setSelectedTab] = useState('delivery') // 'delivery' or 'pickup'
	const [isPickupLoading, setIsPickupLoading] = useState(false)

	const { t } = useTranslation()

	const [address, setAddress] = useState({
		postalCode: '',
		street: '',
		neighborhood: '',
		city: '',
		state: '',
		country: '',
		geoCoordinates: [],
		number: '',
		complement: '',
		reference: '',
		receiverName: cart?.clientProfileData
			? `${cart?.clientProfileData.firstName} ${cart?.clientProfileData.lastName}`
			: '',
		addressQuery: '',
		addressType: ''
	})

	const [customLogisticInfo, setCustomLogisticInfo] = useState([])

	const handleAddressChange = (key, value) => {
		setAddress({
			...address,
			[key]: key === 'receiverName' ? value.replace(/[^a-zA-Z\s]/g, '') : value
		})
	}

	const submit = async () => {
		setAddressError('')
		try {
			await updateCartAddress(cart, address)
			Eitri.navigation.back()
		} catch (e) {
			if (e.response?.status === 400) {
				setAddressError(t('addNewShippingAddress.errorAddress'))
				console.error('Error on submit', e)
				return
			}
			setAddressError(t('addNewShippingAddress.errorDefault'))
			console.error('Error on submit', e)
			return
		}
	}

	const onSelectCustomLogistiInfoOption = async customLogisticInfoOption => {
		await updateCartFreight(cart, customLogisticInfoOption)
	}

	const isValidAddress = () => {
		if (selectedTab === 'pickup') {
			// For pickup points, we need a selected pickup point
			return cart?.shippingData?.address?.addressType === 'pickup'
		}

		if (currentDeliveryIsPickUp()) {
			return true
		}
		return (
			address?.postalCode &&
			address?.street &&
			address?.neighborhood &&
			address?.city &&
			address?.state &&
			address?.receiverName &&
			address?.number
		)
	}

	const currentDeliveryIsPickUp = () => {
		return customLogisticInfo?.options?.some(option => option.isPickupInPoint && option.isCurrent)
	}

	const getPickupAddress = () => {
		const pickUpLogistic = customLogisticInfo?.options?.find(option => option.isPickupInPoint && option.isCurrent)
		return pickUpLogistic?.slas?.[0].pickupStoreInfo?.friendlyName
	}

	const onSelectAddressOnSelector = address => {
		console.log(address)
	}

	const handlePickupPointSelect = async pickupPoint => {
		setIsPickupLoading(true)
		try {
			await setShippingAddress(pickupPoint.address)
		} catch (error) {
			console.error('Error selecting pickup point:', error)
		} finally {
			setIsPickupLoading(false)
		}
	}

	const getPickupPoints = () => {
		return cart?.pickupPoints || []
	}

	const formatBusinessHours = businessHours => {
		if (!businessHours || businessHours.length === 0) return ''

		const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
		const today = new Date().getDay()

		const todayHours = businessHours.find(h => h.DayOfWeek === today)
		if (todayHours) {
			return `Hoje: ${todayHours.OpeningTime.slice(0, 5)} - ${todayHours.ClosingTime.slice(0, 5)}`
		}

		return 'Horário disponível'
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

				<Loading
					fullScreen
					isLoading={isLoading}
				/>

				<View className='flex-1 flex flex-col p-4'>
					<View className='flex flex-col gap-4 flex-1'>
						{adressError && <Text className='mt-2 text-red-700'>{adressError}</Text>}

						{/* Tabs for delivery vs pickup */}
						<AddressTypeTabs
							selectedTab={selectedTab}
							onTabChange={setSelectedTab}
						/>

						{selectedTab === 'pickup' ? (
							<View className='flex flex-col gap-3'>
								<View className='flex flex-col gap-1 mb-4'>
									<Text className='text-lg font-bold text-base-content'>
										{t('addressSelector.pickupTitle', 'Pontos de Retirada')}
									</Text>
									<Text className='text-sm text-base-content/70 mt-1'>
										{t('addressSelector.pickupSubtitle', 'Selecione um ponto de retirada')}
									</Text>
								</View>

								<PickupPointList
									pickupPoints={pickUpOptions}
									selectedAddress={cart?.shippingData?.address}
									onPickupPointSelect={handlePickupPointSelect}
									isLoading={isPickupLoading}
								/>
							</View>
						) : (
							<ShippingMethods
								onSelectCustomLogistiInfoOption={onSelectCustomLogistiInfoOption}
								customLogisticInfo={shippingOptions}
								options={deliveryOptions}
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
						disabled={!isValidAddress()}
						onPress={submit}
					/>
				</View>
			</View>
		</Page>
	)
}
