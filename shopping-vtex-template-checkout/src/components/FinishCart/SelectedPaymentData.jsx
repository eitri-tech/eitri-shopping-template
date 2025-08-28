import { formatAmountInCents, hideCreditCardNumber } from '../../utils/utils'
import SimpleCard from '../Card/SimpleCard'
import iconCard from '../../assets/images/credit_card.svg'
import { useTranslation } from 'eitri-i18n'
import { Image, Text, View } from 'eitri-luminus'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import CardIcon from '../Icons/CardIcons/CardIcon'
import pixImage from '../../assets/images/pix.png'

function CreditCardVisual({ cardInfo, cardName }) {
	const { t } = useTranslation()

	// Determinar a cor do cartão baseado na bandeira detectada
	const getCardGradient = brand => {
		const loBrand = brand.toLowerCase()
		switch (loBrand) {
			case 'visa':
				return 'from-blue-600 via-blue-700 to-blue-800'
			case 'mastercard':
				return 'from-orange-500 via-red-500 to-red-600'
			case 'elo':
				return 'from-green-600 via-green-700 to-green-800'
			case 'amex':
				return 'from-teal-500 via-teal-600 to-teal-700'
			case 'hipercard':
				return 'from-purple-600 via-purple-700 to-purple-800'
			case 'diners':
				return 'from-indigo-600 via-indigo-700 to-indigo-800'
			case 'discover':
				return 'from-orange-600 via-orange-700 to-orange-800'
			default:
				return 'from-slate-600 via-slate-700 to-slate-800'
		}
	}

	return (
		<View
			className={`relative overflow-hidden rounded-lg p-4 bg-gradient-to-br ${getCardGradient(cardName)} shadow-md border border-gray-200`}>
			{/* Efeito de brilho sutil */}
			<View className='absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12' />
			<View className='absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8' />

			{/* Conteúdo do cartão */}
			<View className='relative z-10 flex flex-col gap-3'>
				{/* Header do cartão */}
				<View className='flex flex-row items-center justify-between'>
					<Text className='text-white/80 text-xs font-medium'>CARTÃO DE CRÉDITO</Text>
					<CardIcon
						width={'40px'}
						iconKey={cardName}
					/>
				</View>

				{/* Número do cartão */}
				<View className='flex flex-col gap-1'>
					<Text className='text-white/60 text-xs'>Número do cartão</Text>
					<Text className='text-white text-base font-mono tracking-wider'>
						{hideCreditCardNumber(cardInfo?.cardNumber)}
					</Text>
				</View>

				{/* Informações do titular e validade */}
				<View className='flex flex-row items-end justify-between'>
					{cardInfo?.holderName && (
						<View className='flex flex-col gap-1'>
							<Text className='text-white/60 text-xs'>Titular</Text>
							<Text className='text-white text-sm font-medium'>{cardInfo?.holderName}</Text>
						</View>
					)}

					<View className='flex flex-col gap-1 items-end'>
						<Text className='text-white/60 text-xs'>CVV</Text>
						<Text className='text-white text-sm font-medium'>{cardInfo?.validationCode}</Text>
					</View>
					{cardInfo?.dueDate && (
						<View className='flex flex-col gap-1 items-end'>
							<Text className='text-white/60 text-xs'>Válido até</Text>
							<Text className='text-white text-sm font-medium'>{cardInfo?.dueDate}</Text>
						</View>
					)}
				</View>
			</View>
		</View>
	)
}

export default function SelectedPaymentData(props) {
	const { onPress } = props

	const { cart, cardInfo } = useLocalShoppingCart()

	const { t } = useTranslation()
	const paymentSystem = cart?.paymentData?.payments?.[0]

	const getPaymentSystemDetails = paymentSystem => {
		const ps = cart?.paymentData?.paymentSystems?.find(ps => ps.stringId === paymentSystem.paymentSystem)
		return {
			groupName: ps?.groupName,
			name: ps.name,
			value: paymentSystem.value,
			installment: paymentSystem.installment,
			installmentText: `${paymentSystem?.merchantSellerPayments?.[0]?.installments}x de ${formatAmountInCents(paymentSystem?.merchantSellerPayments?.[0]?.installmentValue)}`
		}
	}

	return (
		<SimpleCard
			isFilled={paymentSystem || cart?.paymentData?.giftCards?.length > 0}
			onPress={onPress}
			title={t('selectedPaymentData.txtPayment')}
			icon={iconCard}>
			<View className={'flex flex-col gap-4'}>
				{cart?.paymentData?.payments?.length > 0 && (
					<View className='flex flex-col gap-4'>
						{cart?.paymentData?.payments?.map(payment => {
							const { name, groupName, installmentText } = getPaymentSystemDetails(payment)

							if (groupName === 'creditCardPaymentGroup') {
								return (
									<View
										key={payment.paymentSystem}
										className='flex flex-col gap-3'>
										{/* Cartão visual */}
										<CreditCardVisual
											cardInfo={cardInfo}
											cardName={name}
										/>

										{/* Informações adicionais do cartão */}
										<View className='bg-white border border-gray-200 rounded-lg p-3'>
											<View className='flex flex-col items-center gap-1'>
												<Text className='text-xs text-gray-600'>Parcelamento</Text>
												<Text className='text-sm font-bold text-primary'>
													{installmentText}
												</Text>
											</View>
										</View>
									</View>
								)
							}

							if (groupName === 'instantPaymentPaymentGroup') {
								return (
									<View
										key={payment.paymentSystem}
										className='flex flex-col gap-4 p-4 justify-center items-center'>
										<Image
											src={pixImage}
											className='w-[130px] object-contain'
										/>
										<Text className='text-sm'>Aprovação imediata</Text>
									</View>
								)
							}

							return (
								<View
									key={payment.paymentSystem}
									className='flex items-center gap-2'>
									<Text className='text-sm font-medium text-base-content/80'>{name}</Text>
								</View>
							)
						})}
					</View>
				)}
				{cart?.paymentData?.giftCards && cart?.paymentData?.giftCards?.length > 0 && (
					<View className='flex flex-col gap-3'>
						<View className='flex items-center gap-2'>
							<Text className='text-sm font-medium text-base-content/80'>
								Pagamento com vale presente:
							</Text>
						</View>

						<View className='flex flex-col gap-2'>
							{cart?.paymentData?.giftCards
								?.filter(gift => gift.redemptionCode)
								.map((gift, index) => (
									<View
										key={index}
										className='flex items-center justify-between p-3 bg-neutral-50 rounded'>
										<View className='flex flex-col'>
											<Text className='text-xs text-base-content/60'>Código</Text>
											<Text className='text-sm font-mono font-medium text-base-content'>
												{gift.redemptionCode}
											</Text>
										</View>
										<View className='flex flex-col items-end'>
											<Text className='text-xs text-base-content/60'>Valor</Text>
											<Text className='text-sm font-bold'>{formatAmountInCents(gift.value)}</Text>
										</View>
									</View>
								))}
						</View>
					</View>
				)}
			</View>
		</SimpleCard>
	)
}
