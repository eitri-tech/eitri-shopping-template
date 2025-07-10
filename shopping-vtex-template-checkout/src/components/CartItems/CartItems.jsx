import { formatAmountInCents } from '../../utils/utils'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'
import { View, Text, Image } from 'eitri-luminus'

export default function CartItems() {
	const { t } = useTranslation()
	const { cart } = useLocalShoppingCart()

	const items = cart?.items || []

	if (items.length === 0) {
		return (
			<View className='w-full p-4 border border-neutral-700 flex flex-col rounded'>
				<Text className='text-neutral-600 text-center'>
					{t('finishCart.txtNoItems') || 'Nenhum item no carrinho'}
				</Text>
			</View>
		)
	}

	return (
		<View className='w-full p-4 border border-neutral-700 flex flex-col rounded gap-3'>
			<View className='flex flex-row w-full justify-between items-center'>
				<Text className='text-neutral-700 font-bold'>{t('finishCart.txtItems') || 'Itens do Carrinho'}</Text>
			</View>

			{/* Cart Items */}
			<View className='flex flex-col gap-3'>
				{items.map((item, index) => {
					const priceDefinition = item.priceDefinition || {}
					const calculatedPrice = priceDefinition.calculatedSellingPrice || 0
					const totalPrice = priceDefinition.total || 0
					const quantity = priceDefinition.sellingPrices?.[0]?.quantity || 1

					return (
						<View
							key={index}
							className='flex flex-row gap-3 p-3 bg-neutral-50 rounded-lg'>
							{/* Product Image */}
							<View className='w-16 h-16 flex-shrink-0'>
								<Image
									className='w-full h-full object-cover rounded-md'
									src={item.imageUrl || 'https://via.placeholder.com/64x64?text=Produto'}
									alt={item.name || 'Produto'}
								/>
							</View>

							{/* Product Details */}
							<View className='flex-1 flex flex-col justify-between'>
								<View className='flex flex-col gap-1'>
									<Text className='text-neutral-800 font-medium text-sm line-clamp-2'>
										{item.name || 'Nome do produto não disponível'}
									</Text>

									{/* Quantity and Price */}
									<View className='flex flex-row justify-between items-center'>
										<Text className='text-neutral-600 text-xs'>{`Qtd: ${quantity}`}</Text>
										<Text className='text-neutral-700 font-medium text-sm'>
											{formatAmountInCents(calculatedPrice)}
										</Text>
									</View>
								</View>

								{/* Total Price for this item */}
								<View className='flex flex-row justify-between items-center pt-1 border-t border-neutral-200'>
									<Text className='text-neutral-600 text-xs'>
										{t('finishCart.txtSubtotal') || 'Subtotal'}
									</Text>
									<Text className='text-primary-700 font-bold text-sm'>
										{formatAmountInCents(totalPrice)}
									</Text>
								</View>
							</View>
						</View>
					)
				})}
			</View>
		</View>
	)
}
