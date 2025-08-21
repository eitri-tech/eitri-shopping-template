import { View } from 'eitri-luminus'
import { CustomButton, BottomInset } from 'eitri-shopping-montreal-shared'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { navigateToCheckout } from '../../services/navigationService'

export default function ActionButton(props) {
	const { cart } = useLocalShoppingCart()
	const { t } = useTranslation()

	const goToCheckout = async () => {
		if (isValidToProceed()) {
			navigateToCheckout(cart?.orderFormId)
		}
	}

	const isValidToProceed = () => {
		if (!cart) return false
		if (!cart?.items) return false
		return cart?.items.length !== 0
	}

	return (
		<>
			<View className='fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-300'>
				<View className='p-4'>
					<CustomButton
						disabled={!isValidToProceed()}
						label={t('cartSummary.labelFinish')}
						onPress={goToCheckout}
					/>
				</View>
				<BottomInset />
			</View>

			<View className={'h-[77px]'} />

			<BottomInset />
		</>
	)
}
