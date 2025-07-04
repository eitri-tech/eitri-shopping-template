import { Page, View, Text } from 'eitri-luminus'
import {
	CustomButton,
	Loading,
	HeaderReturn,
	HeaderContentWrapper,
	HeaderText,
	CustomInput
} from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import PaymentMethods from '../components/Methods/PaymentMethods'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import GiftCardInput from '../components/GiftCardInput/GiftCardInput'
import { formatAmountInCents } from '../utils/utils'

export default function PaymentData(props) {
	const { cart, selectPaymentOption } = useLocalShoppingCart()

	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		sendPageView('Dados de pagamento')
	}, [])

	const submitPaymentSystemSelected = async () => {
		await Eitri.navigation.back()
	}

	const handlePaymentOptionsChange = async (paymentMethod, silentMode = false) => {
		try {
			!silentMode && setIsLoading(true)
			const payload = {
				payments: Array.isArray(paymentMethod) ? paymentMethod : [paymentMethod],
				giftCards: cart.paymentData.giftCards
			}
			await selectPaymentOption(payload)
		} catch (error) {
			console.log('Erro ao selecionar método de pagamento', error)
		} finally {
			!silentMode && setIsLoading(false)
		}
	}

	if (!cart) {
		return
	}

	return (
		<Page title='Checkout - Dados de pagamento'>
			<View className='min-h-[100vh] flex flex-col'>
				<HeaderContentWrapper
					gap={16}
					scrollEffect={false}>
					<HeaderReturn />
					<HeaderText text={t('paymentData.title')} />
				</HeaderContentWrapper>

				<Loading
					fullScreen
					isLoading={isLoading}
				/>

				<View className='flex-1 p-4 flex flex-col gap-4'>
					<View className='flex flex-row justify-between items-center'>
						<Text className='text-xs font-bold'>{t('paymentData.txtTotalPayment')}</Text>
						<Text className='text-sm font-bold text-primary-700'>{formatAmountInCents(cart.value)}</Text>
					</View>

					<View>
						<GiftCardInput onPressAddGiftCard={handlePaymentOptionsChange} />
					</View>

					<View className='flex flex-col gap-4 py-4'>
						<PaymentMethods onSelectPaymentMethod={handlePaymentOptionsChange} />
					</View>
				</View>

				<View
					bottomInset
					className='p-4'>
					<CustomButton
						disabled={false}
						label={t('paymentData.labelButton')}
						onPress={submitPaymentSystemSelected}
					/>
				</View>
			</View>
		</Page>
	)
}
