import { hideCreditCardNumber } from '../../utils/utils'
import SimpleCard from '../Card/SimpleCard'
import iconCard from '../../assets/images/credit_card.svg'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function SelectedPaymentData(props) {
	const { onPress } = props

	const { cart, cardInfo } = useLocalShoppingCart()
	const { t } = useTranslation()

	const currentPayments = cart?.paymentData?.payments?.map(payment => {
		const paymentSystem = cart?.paymentData?.paymentSystems?.find(p => p.stringId === payment.paymentSystem)
		const isCreditCard = paymentSystem?.groupName === 'creditCardPaymentGroup'

		return {
			...payment,
			paymentSystemName: paymentSystem?.name,
			isCreditCard,
			cardInfo,
			hasMissingValues: isCreditCard && !cardInfo?.cardNumber
		}
	})

	return (
		<SimpleCard
			isFilled={currentPayments?.length > 0}
			onPress={onPress}
			title={t('selectedPaymentData.txtPayment')}
			icon={iconCard}>
			<>
				{currentPayments?.map(payment => (
					<View className='flex flex-col gap-3'>
						<Text className='text-xs text-neutral-900'>{payment?.paymentSystemName}</Text>

						{payment?.isCreditCard?.cardInfo && (
							<>
								{payment?.cardInfo?.cardNumber && (
									<Text>{hideCreditCardNumber(payment?.cardInfo?.cardNumber)}</Text>
								)}
								{payment?.cardInfo?.holderName && <Text>{payment?.cardInfo?.holderName}</Text>}
								{payment?.cardInfo?.installment && <Text>{payment?.cardInfo?.installment?.label}</Text>}
							</>
						)}
					</View>
				))}

				{currentPayments?.some(p => p.hasMissingValues) && (
					<Text className='text-xs text-negative-700'>{t('selectedPaymentData.txtFillCard')}</Text>
				)}
			</>
		</SimpleCard>
	)
}
