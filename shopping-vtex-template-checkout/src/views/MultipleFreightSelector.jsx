import { useLocalShoppingCart } from '../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { Page, Text, View } from 'eitri-luminus'
import { navigate } from '../services/navigationService'
import { useState } from 'react'
import { productGroupShippingResolver } from 'shopping-vtex-template-shared'
import FixedBottom from '../components/FixedBottom/FixedBottom'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { HeaderContentWrapper, HeaderReturn, CustomButton } from 'shopping-vtex-template-shared'
import { FaChevronRight } from 'react-icons/fa'

function AddressSelectorCard({ sla }) {
	const formatAddress = address => {
		return `${address?.street}, ${address?.number || ''} ${address?.complement || ''} - ${address?.neighborhood}`
	}

	const label = sla.isPickupInPoint
		? `Retire na loja ${sla.pickupStoreInfo.friendlyName}`
		: `${sla.formatedShippingEstimate}`

	return (
		<View className='flex flex-row items-start w-full gap-3'>
			<View className='flex flex-col w-full gap-1'>
				<Text className='font-bold'>{label}</Text>

				{sla.isPickupInPoint && (
					<View className='bg-primary px-2 py-1 rounded-full w-fit flex items-center justify-center'>
						<Text className='text-xs text-primary-content'>{sla?.formatedShippingEstimate}</Text>
					</View>
				)}

				<Text className='text text-neutral-500'>
					{sla?.pickupStoreInfo?.isPickupStore
						? formatAddress(sla.pickupStoreInfo.address)
						: formatAddress(sla.deliveryAddress)}
				</Text>

				<View className='flex items-center'>
					<Text className={`font-semibold ${sla.formattedTotalPrice === 'Grátis' ? 'text-green-600' : ''}`}>
						{sla?.formattedTotalPrice}
					</Text>
				</View>
			</View>
		</View>
	)
}

export default function MultipleFreightSelector(props) {
	const { cart, setFreight } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)

	const { t } = useTranslation()

	const submit = async () => {
		navigate('PaymentData', {}, true)
	}

	const shippingOptions = productGroupShippingResolver(cart)

	const getCurrentSla = (slas, currentSla) => {
		return slas.find(sla => sla.id === currentSla)
	}

	// console.log('shippingOptions===>', shippingOptions)

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

				<View className={'flex flex-col gap-4'}>
					{shippingOptions?.map((group, index) => (
						<View className='bg-white rounded shadow-sm border border-gray-300 p-4 w-full flex flex-col'>
							<View className='flex flex-row items-center justify-between mb-3 border-b'>
								<Text className='font-bold'>{`Pacote ${index + 1}`}</Text>
								<View className='flex flex-row gap-4 mb-3'>
									{group?.items?.slice(0, 4)?.map(product => (
										<View
											key={product.imageUrl}
											className='w-10 h-10 p-1 rounded-full overflow-hidden border'>
											<Image
												src={product.imageUrl}
												width='100%'
												height='100%'
												className='object-cover'
											/>
										</View>
									))}
								</View>
							</View>

							{getCurrentSla(group.slas, group.currentSla) ? (
								<AddressSelectorCard
									sla={getCurrentSla(group.slas, group.currentSla)}
									currentSla={group.currentSla}
								/>
							) : (
								<View
									onClick={() => navigate('FreightGroupSelectorOptions', { group })}
									className='flex flex-col'>
									<View className='flex flex-row items-center justify-between mb-1 gap-2'>
										<Text className='font-bold text-lg block'>
											{`Escolha como receber ${group?.items?.length === 1 ? 'seu produto' : 'seus produtos'}`}
										</Text>
										<FaChevronRight className='text-primary w-[24px]' />
									</View>
								</View>
							)}

							{getCurrentSla(group.slas, group.currentSla) && group.slas.length > 1 && (
								<>
									<View className='border-b my-4'></View>

									<View onClick={() => navigate('FreightGroupSelectorOptions', { group })}>
										<Text className='text-primary font-bold'>Ver mais opções</Text>
									</View>
								</>
							)}
						</View>
					))}
				</View>
			</View>

			<FixedBottom
				className='flex flex-col align-center gap-4'
				offSetHeight={120}>
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
