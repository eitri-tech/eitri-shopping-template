import { formatAmountInCents } from '../../utils/utils'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { useTranslation } from 'eitri-i18n'

export default function CartSummary() {
	const { t } = useTranslation()
	const { cart } = useLocalShoppingCart()

	return (
		<View className='flex flex-row w-full justify-between items-center mb-6 pt-1'>
			<Text className='text-neutral-700 font-bold'>
				{`${cart?.items?.length} ${
					cart?.items?.length < 2 ? t('finishCart.txtProduct') : t('finishCart.txtProducts')
				}`}
			</Text>
			<Text className='font-bold text-primary-700'>
				{`${t('finishCart.txtTotal')} ${formatAmountInCents(cart?.value)}`}
			</Text>
		</View>
	)
}
