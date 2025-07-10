import { formatAmountInCents } from '../../utils/utils'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { View, Text } from 'eitri-luminus'

export default function CartSummary() {
	const { t } = useTranslation()
	const { cart } = useLocalShoppingCart()

	// Extract totalizers from cart
	const totalizers = cart?.totalizers || []
	const itemsTotal = totalizers.find(t => t.id === 'Items')?.value || 0
	const shippingTotal = totalizers.find(t => t.id === 'Shipping')?.value || 0
	const discountTotal = totalizers.find(t => t.id === 'discount')?.value || 0

	// Calculate final total
	const finalTotal = itemsTotal + shippingTotal - discountTotal

	return (
		<View className='w-full p-4 border border-neutral-700 flex flex-col rounded gap-3'>
			{/* Totalizers breakdown */}
			<View className='flex flex-col gap-2'>
				{itemsTotal > 0 && (
					<View className='flex flex-row justify-between items-center'>
						<Text className='text-neutral-600 text-sm'>
							{totalizers.find(t => t.id === 'Items')?.name || 'Total dos Itens'}
						</Text>
						<Text className='text-neutral-700 font-medium'>{formatAmountInCents(itemsTotal)}</Text>
					</View>
				)}

				{shippingTotal > 0 && (
					<View className='flex flex-row justify-between items-center'>
						<Text className='text-neutral-600 text-sm'>
							{totalizers.find(t => t.id === 'Shipping')?.name || 'Total do Frete'}
						</Text>
						<Text className='text-neutral-700 font-medium'>{formatAmountInCents(shippingTotal)}</Text>
					</View>
				)}

				{discountTotal > 0 && (
					<View className='flex flex-row justify-between items-center'>
						<Text className='text-neutral-600 text-sm'>
							{totalizers.find(t => t.id === 'discount')?.name || 'Desconto'}
						</Text>
						<Text className='text-red-600 font-medium'>-{formatAmountInCents(discountTotal)}</Text>
					</View>
				)}
			</View>

			{/* Final total */}
			<View className='flex flex-row w-full justify-between items-center pt-2 border-t border-neutral-300'>
				<Text className='text-neutral-700 font-bold'>{t('finishCart.txtTotal')}</Text>
				<Text className='font-bold text-primary-700'>{formatAmountInCents(finalTotal)}</Text>
			</View>
		</View>
	)
}
