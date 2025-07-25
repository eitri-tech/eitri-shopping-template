import { View, Text, Button } from 'eitri-luminus'
import { CustomButton, Spacing, Divisor } from 'shopping-vtex-template-shared'
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

	const goToCheckout = async () => {
		if (isValidToProceed(cart)) {
			navigateToCheckout(cart?.orderFormId)
		}
	}

	const isValidToProceed = cart => {
		if (!cart) return false
		if (!cart?.items) return false
		if (cart?.shipping?.shippingUnavailable) return false
		return cart?.items.length !== 0
	}

	return (
		<>
			<View
				bottomInset={'auto'}
				className='bg-base-100 fixed bottom-0 left-0 w-full border-t border-neutral-300 z-50 flex flex-col items-center'>
				<View
					onClick={() => setCollapsed(!collapsed)}
					className='flex justify-center w-full py-2 cursor-pointer'>
					{collapsed ? (
						<svg
							width='24px'
							height='24px'
							viewBox='0 0 16 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M13.4454 10.4455L8.71747 5.71758C8.32694 5.32705 7.69378 5.32705 7.30325 5.71758L2.57532 10.4455'
								stroke='#707070'
								strokeLinecap='round'
							/>
						</svg>
					) : (
						<svg
							width='24px'
							height='24px'
							viewBox='0 0 16 16'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M2.57535 5.42468L7.30328 10.1526C7.69381 10.5431 8.32697 10.5431 8.7175 10.1526L13.4454 5.42468'
								stroke='#707070'
								strokeLinecap='round'
							/>
						</svg>
					)}
				</View>

				{!collapsed && (
					<View className='w-full flex justify-center'>
						<View className='card-body w-full max-w-sm px-4'>
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
				)}

				<View className='h-2' />

				<View className='flex w-full max-w-sm justify-center px-4 items-center pb-4'>
					<CustomButton
						label={t('cartSummary.labelFinish')}
						onPress={goToCheckout}
						className='btn-primary w-full text-base font-semibold py-3 rounded-lg shadow-md'
					/>
				</View>
			</View>
			{/* Espaço reservado para evitar sobreposição do conteúdo da página */}
			<View
				bottomInset={'auto'}
				className={collapsed ? 'h-[111px]' : 'h-[260px]'}
			/>
			<View bottomInset={'auto'} />
		</>
	)
}
