import { useTranslation } from 'eitri-i18n'
import { Badge, Text, View } from 'eitri-luminus'
import { useLocalShoppingCart } from '../../../providers/LocalCart'
import { navigate } from '../../../services/navigationService'
import Pix from '../../Icons/MethodIcons/Pix'
import GroupsWrapper from './GroupsWrapper'

export default function InstantPayment(props) {
	const { cart } = useLocalShoppingCart()
	const { systemGroup, onSelectPaymentMethod } = props
	const { t } = useTranslation()

	const VTEX_INSTANT_PAYMENT = '125'

	const onSelectThisGroup = async () => {
		await onSelectPaymentMethod([
			{
				paymentSystem: VTEX_INSTANT_PAYMENT,
				installmentsInterestRate: 0,
				installments: 1,
				referenceValue: cart.value,
				value: cart.value,
				hasDefaultBillingAddress: true
			}
		])
		//trackAddPaymentInfo(cart, 'Pix')
		navigate('CheckoutReview')
	}

	const pixBenefits = cart?.ratesAndBenefitsData?.rateAndBenefitsIdentifiers?.find(b => b.name === '3% OFF Pix')

	return (
		<GroupsWrapper
			title={t('paymentMethods.instantPayment.title', 'Pix')}
			subtitle={t('paymentMethods.instantPayment.subtitle', 'Pagamento instantâneo')}
			icon={<Pix />}
			onPress={onSelectThisGroup}
			isChecked={systemGroup.isCurrentPaymentSystemGroup}>
			<View onClick={onSelectThisGroup}>
				{pixBenefits && (
					<View className='flex flex-row items-center gap-2 mb-3'>
						<Badge className='badge-success badge-lg font-bold text-white shadow-md text-sm'>
							{t('paymentMethods.instantPayment.discount', '3% OFF')}
						</Badge>
					</View>
				)}
				<View className='mt-2 bg-neutral-100 p-4 rounded'>
					<Text className='text-sm text-neutral-500'>
						{t(
							'paymentMethods.instantPayment.info',
							'O código Pix será exibido na próxima etapa, após a revisão do seu pedido.'
						)}
					</Text>
				</View>
			</View>
		</GroupsWrapper>
	)
}
