import { View, Text, Button } from 'eitri-luminus'
import { CustomButton, Spacing, Divisor } from 'eitri-shopping-montreal-shared'
import { useTranslation } from 'eitri-i18n'
import { formatAmountInCents } from '../../utils/utils'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { navigateToCheckout } from '../../services/navigationService'

export default function CartSummary(props) {
	const { cart } = useLocalShoppingCart()

	const [collapsed, setCollapsed] = useState(true)
	const [itemsValue, setItemsValue] = useState({ value: null })
	const [shipping, setShipping] = useState({ value: null })
	const [discounts, setDiscounts] = useState({ value: null })

	const { t } = useTranslation()

	useEffect(() => {
		if (!cart) return
		setItemsValue(getTotalizerById(cart.totalizers, 'Items'))
		setShipping(getTotalizerById(cart.totalizers, 'Shipping'))
		setDiscounts(getTotalizerById(cart.totalizers, 'Discounts'))
	}, [cart])

	const getTotalizerById = (totalizers, id) => totalizers.find(item => item.id === id)

	return (
		<View className='px-4'>
			<View className='bg-white rounded shadow-sm border border-gray-300 p-4'>
				<View className='w-full flex justify-center'>
					<View className='w-full max-w-sm px-4'>
						{itemsValue?.value && (
							<View className='flex justify-between py-2'>
								<Text className='text-base-content/70 text-sm'>{t('cartSummary.txtSubtotal')}</Text>
								<Text className='text-sm'>{formatAmountInCents(itemsValue.value)}</Text>
							</View>
						)}
						{discounts?.value && (
							<View className='flex justify-between py-2'>
								<Text className='text-base-content/70 text-sm'>{t('cartSummary.txtDiscount')}</Text>
								<Text className='text-sm'>{formatAmountInCents(discounts.value)}</Text>
							</View>
						)}
						{shipping && (
							<View className='flex justify-between py-2'>
								<Text className='text-base-content/70 text-sm'>{t('cartSummary.txtDelivery')}</Text>
								<Text className='text-sm'>{formatAmountInCents(shipping.value)}</Text>
							</View>
						)}
						{cart?.value && (
							<View className='flex justify-between py-2 border-t border-base-300 mt-2 pt-2'>
								<Text className='text-base-content font-bold text-base'>
									{t('cartSummary.txtTotal')}
								</Text>
								<Text className='text-base font-bold text-primary'>
									{formatAmountInCents(cart.value)}
								</Text>
							</View>
						)}
					</View>
				</View>
			</View>
		</View>
	)
}
