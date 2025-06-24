import { formatAmountInCents, hideCreditCardNumber } from '../../utils/utils'
import SimpleCard from '../Card/SimpleCard'
import iconCard from '../../assets/images/credit_card.svg'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function SelectedPaymentData(props) {
	const { cart } = useLocalShoppingCart()

	const { onPress, payments, selectedPaymentData } = props
	const { t } = useTranslation()

	const paymentSystem = payments?.[0]
	const paymentWithCardHasMissingValues = () => {
		if (paymentSystem?.groupName === 'creditCardPaymentGroup') {
			if (!selectedPaymentData?.cardInfo?.cardNumber) {
				return true
			}
		}

		return false
	}

	return (
		<SimpleCard
			isFilled={paymentSystem}
			onPress={onPress}
			title={t('selectedPaymentData.txtPayment')}
			icon={iconCard}>
			<>
				{paymentSystem && (
					<View
						direction='column'
						display='flex'
						gap={3}>
						<Text
							fontSize='extra-small'
							color='neutral-900'>
							{paymentSystem?.name}
						</Text>

						{selectedPaymentData?.cardInfo && (
							<>
								{selectedPaymentData?.cardInfo?.cardNumber && (
									<Text>{hideCreditCardNumber(selectedPaymentData.cardInfo?.cardNumber)}</Text>
								)}
								{selectedPaymentData.cardInfo?.holderName && (
									<Text>{selectedPaymentData.cardInfo?.holderName}</Text>
								)}
								{selectedPaymentData.cardInfo?.installment && (
									<Text>{selectedPaymentData.cardInfo?.installment?.label}</Text>
								)}
							</>
						)}

						{paymentWithCardHasMissingValues() && (
							<Text
								fontSize='extra-small'
								color='negative-700'>
								{t('selectedPaymentData.txtFillCard')}
							</Text>
						)}
					</View>
				)}
			</>
		</SimpleCard>
	)
}
