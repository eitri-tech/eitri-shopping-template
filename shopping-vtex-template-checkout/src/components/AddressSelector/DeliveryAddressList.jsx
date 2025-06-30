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

	const currentSelectedAddress = addresses.find(address => selectedAddress?.addressId === address?.addressId)
	const otherAddresses = addresses.filter(address => selectedAddress?.addressId !== address?.addressId)

	return (
		<View className='flex flex-col gap-3'>
			{currentSelectedAddress && (
				<>
					<View className='mb-2'>
						<Text className='text-sm font-medium text-primary mb-2'>
							{t('addressSelector.selectedAddress', 'Endereço Selecionado')}
						</Text>
					</View>
					{isLoading ? (
						<Skeleton className='h-[100px] w-full rounded' />
					) : (
						<AddressCard
							address={currentSelectedAddress}
							isSelected={true}
							onClick={() => onAddressSelect(currentSelectedAddress)}
						/>
					)}
				</>
			)}

			{otherAddresses.length > 0 && (
				<>
					<View className='mb-2'>
						<Text className='text-sm font-medium text-base-content/70 mb-2'>
							{t('addressSelector.otherAddresses', 'Outros Endereços')}
						</Text>
					</View>
					{otherAddresses.map((address, index) => (
						<View key={address.id || index}>
							{isLoading ? (
								<Skeleton className='h-[100px] w-full rounded' />
							) : (
								<AddressCard
									address={address}
									isSelected={false}
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
