import { useLocalShoppingCart } from '../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { Page, Radio, Text, View } from 'eitri-luminus'
import { navigate } from '../services/navigationService'
import { useState } from 'react'
import { productGroupShippingResolver } from 'shopping-vtex-template-shared'
import FixedBottom from '../components/FixedBottom/FixedBottom'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { HeaderContentWrapper, HeaderReturn, CustomButton } from 'shopping-vtex-template-shared'

export default function MultipleFreightSelector(props) {
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
		} catch (error) {
			console.error('Error on select freight option', error)
		} finally {
			setIsLoading(false)
		}
	}

	const shippingOptions = productGroupShippingResolver(cart)

	const deliveryOptions = shippingOptions?.options?.filter(opt => !opt.isPickupInPoint)

	// console.log('shippingOptions', shippingOptions)

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
				<Text className='text-xl font-bold'>Seus produtos possuem diferentes tipos de entrega</Text>

				<View className={'flex flex-col gap-4'}>
					{shippingOptions?.map((logisticInfo, index) => (
						<View className='bg-white rounded shadow-sm border border-gray-300 p-4 w-full flex flex-col gap-3'>
							<View className='flex flex-row gap-4'>
								{logisticInfo?.items?.map(product => (
									<View>
										<Image
											src={product.imageUrl}
											className='w-12 h-12 rounded-full object-contain'
										/>
									</View>
								))}
							</View>

							{logisticInfo.slas?.map(sla => {
								const label = sla.isPickupInPoint
									? `${sla.pickupStoreInfo.friendlyName}`
									: `${sla.formatedShippingEstimate}`

								return (
									<View
										key={`${index}_${sla.id}`}
										className='flex flex-row items-center w-full gap-4'
										onClick={() => onSelectFreightOption(sla, logisticInfo.items)}>
										<Radio
											className='radio-primary'
											checked={sla.id === logisticInfo.currentSla}
											name={`${index}_freight-option-delivery`}
											onChange={() => onSelectFreightOption(sla, logisticInfo.items)}
										/>
										<View className='w-full flex flex-col flex-1 ml-3'>
											<Text className='font-bold'>{label}</Text>
											<Text className='text-xs text-neutral-500'></Text>
										</View>
										<View className='flex items-center'>
											<Text
												className={`font-semibold ${sla.formattedTotalPrice === 'Grátis' ? 'text-green-600' : ''}`}>
												{sla?.formattedTotalPrice}
											</Text>
										</View>
									</View>
								)
							})}
						</View>
					))}
				</View>
			</View>

			<FixedBottom
				className='flex flex-col align-center gap-4'
				offSetHeight={117}>
				<CustomButton
					disabled={!shippingOptions?.every(opt => opt.currentSla)}
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
