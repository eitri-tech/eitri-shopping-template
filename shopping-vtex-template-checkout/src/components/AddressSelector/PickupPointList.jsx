import { View, Text, Skeleton } from 'eitri-luminus'
import AddressCard from './AddressCard'
import { useTranslation } from 'eitri-i18n'

export default function PickupPointList({ pickupPoints, selectedAddress, onPickupPointSelect, isLoading }) {
	const { t } = useTranslation()

	const currentSelectedPickup = pickupPoints.find(pickup => selectedAddress?.addressId === pickup?.address?.addressId)
	const otherPickupPoints = pickupPoints.filter(pickup => selectedAddress?.addressId !== pickup?.address?.addressId)

	return (
		<View className='flex flex-col gap-3'>
			{currentSelectedPickup && (
				<>
					<View className='mb-2'>
						<Text className='text-sm font-medium text-primary mb-2'>
							{t('addressSelector.selectedPickup', 'Ponto de Retirada Selecionado')}
						</Text>
					</View>
					{isLoading ? (
						<Skeleton className='h-[120px] w-full rounded' />
					) : (
						<AddressCard
							address={currentSelectedPickup}
							isSelected={true}
							onClick={() => onPickupPointSelect(currentSelectedPickup)}
							showBusinessHours={true}
						/>
					)}
				</>
			)}

			{otherPickupPoints.length > 0 && (
				<>
					<View className='mb-2'>
						<Text className='text-sm font-medium text-base-content/70 mb-2'>
							{t('addressSelector.otherPickupPoints', 'Outros Pontos de Retirada')}
						</Text>
					</View>
					{otherPickupPoints.map((pickupPoint, index) => (
						<View key={pickupPoint.id || index}>
							{isLoading ? (
								<Skeleton className='h-[120px] w-full rounded' />
							) : (
								<AddressCard
									address={pickupPoint}
									isSelected={false}
									onClick={() => onPickupPointSelect(pickupPoint)}
									showBusinessHours={true}
								/>
							)}
						</View>
					))}
				</>
			)}

			{pickupPoints.length === 0 && (
				<View className='text-center py-8'>
					<Text className='text-base-content/50'>
						{t('addressSelector.noPickupPoints', 'Nenhum ponto de retirada disponível')}
					</Text>
				</View>
			)}
		</View>
	)
}
