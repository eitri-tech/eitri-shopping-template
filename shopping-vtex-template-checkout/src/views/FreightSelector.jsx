import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	HeaderReturn,
	HeaderContentWrapper,
	HeaderText,
	cartShippingResolver,
	BottomInset
} from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { Page, View, Text, Radio, Loading, Divider } from 'eitri-luminus'
import AddressTypeTabs from '../components/AddressSelector/AddressTypeTabs'
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

		// if (!cart?.shippingData?.address?.number) {
		// 	navigate('AddressForm', { addressId: cart?.shippingData?.address?.addressId }, true)
		// 	return
		// }

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
		navigate('FinishCart', {}, true)
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
					<View className='bg-white rounded shadow-sm border border-gray-300 p-4 w-full flex flex-col'>
						<View className='flex flex-col gap-1 mb-2'>
							<Text className='text-lg font-bold text-base-content'>
								{t('shippingMethods.txtSelectDelivery', 'Como deseja se receber seu produto?')}
							</Text>
						</View>

						{deliveryOptions?.length > 0 && pickUpOptions?.length > 0 && (
							<AddressTypeTabs
								selectedTab={selectedTab}
								onTabChange={setSelectedTab}
							/>
						)}

						{isLoading ? (
							<View className='w-full flex items-center justify-center my-8'>
								<Loading />
							</View>
						) : (
							<>
								{/* Opções de Entrega */}
								{selectedTab === 'delivery' && deliveryOptions?.length > 0 && (
									<View className='mt-4'>
										{deliveryOptions.map((item, index) => (
											<>
												<View
													key={index}
													className='flex flex-row items-center w-full py-3 cursor-pointer'
													onClick={() => onSelectFreightOption(item)}>
													<Radio
														className='radio-primary'
														checked={item.isCurrent}
														name='freight-option-delivery'
														value={item?.label}
														onChange={() => onSelectFreightOption(item)}
													/>
													<View className='w-full flex flex-col flex-1 ml-3'>
														<Text className='font-bold'>{item?.label}</Text>
														<Text className='text-xs text-neutral-500'>
															{item?.shippingEstimate}
														</Text>
													</View>
													<View className='flex items-center'>
														<Text className='font-semibold'>{item?.price}</Text>
													</View>
												</View>
												{index < deliveryOptions.length - 1 && (
													<View className='w-full h-px bg-base-200 my-2' />
												)}
											</>
										))}
									</View>
								)}

								{/* Opções de Retirada */}
								{selectedTab === 'pickup' && pickUpOptions?.length > 0 && (
									<View className='mt-4'>
										<Text className='text-sm font-semibold text-neutral-700 mb-2'>
											{t('freight.tabPickup', 'Retirada')}
										</Text>
										{pickUpOptions.map((item, index) => (
											<>
												<View
													key={index}
													className='flex flex-row items-center w-full py-3 cursor-pointer'
													onClick={() => onSelectFreightOption(item)}>
													<Radio
														className='radio-primary'
														checked={item.isCurrent}
														name='freight-option-pickup'
														value={item?.label}
														onChange={() => onSelectFreightOption(item)}
													/>
													<View className='w-full flex flex-col flex-1 ml-3'>
														<Text className='font-bold'>{item?.label}</Text>
														<Text className='text-xs text-neutral-500'>
															{item?.shippingEstimate}
														</Text>
														{item.isPickupInPoint && (
															<Text className='text-xs text-neutral-500'>
																{item?.pickUpAddress}
															</Text>
														)}
													</View>
													<View className='flex items-center'>
														<Text className='font-semibold'>{item?.price}</Text>
													</View>
												</View>
												{index < pickUpOptions.length - 1 && (
													<View className='w-full h-px bg-base-200 my-2' />
												)}
											</>
										))}
									</View>
								)}
							</>
						)}
					</View>

					<View className='pt-4'>
						<CustomButton
							label={'Alterar endereço de entrega'}
							outlined
							onPress={() => navigate('AddressSelector', {}, true)}
						/>
					</View>
				</View>

				<View className='p-4'>
					<CustomButton
						label={t('addNewShippingAddress.labelButton')}
						onPress={submit}
					/>
					<BottomInset />
				</View>
			</View>
		</Page>
	)
}
