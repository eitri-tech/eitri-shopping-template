import { View, Text, Skeleton } from 'eitri-luminus'
import { CustomButton } from 'shopping-vtex-template-shared'
import AddressCard from './AddressCard'
import { useTranslation } from 'eitri-i18n'

export default function DeliveryAddressList({
	addresses,
	selectedAddress,
	onAddressSelect,
	onAddNewAddress,
	isLoading
}) {
	const { t } = useTranslation()

	return (
		<View className='flex flex-col gap-3'>
			{addresses.length > 0 && (
				<>
					<View className='mb-2'>
						<Text className='text-sm font-medium text-primary mb-2'>
							{t('addressSelector.addresses', 'Endereços')}
						</Text>
					</View>
					{addresses.map((address, index) => (
						<View key={address.id || index}>
							{isLoading ? (
								<Skeleton className='h-[100px] w-full rounded' />
							) : (
								<AddressCard
									address={address}
									isSelected={selectedAddress?.addressId === address?.addressId}
									onClick={() => onAddressSelect(address)}
								/>
							)}
						</View>
					))}
				</>
			)}

			<CustomButton
				outlined
				onClick={onAddNewAddress}
				label={t('addressSelector.addNewAddress', 'Adicionar Novo Endereço')}
			/>
		</View>
	)
}
