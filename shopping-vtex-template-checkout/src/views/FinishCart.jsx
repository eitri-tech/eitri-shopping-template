import Eitri from 'eitri-bifrost'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { CustomButton, Loading, HeaderContentWrapper, HeaderReturn, HeaderText } from 'shopping-vtex-template-shared'
import { clearCart, startPayment } from '../services/cartService'
import Recaptcha from '../services/Recaptcha'
import UserData from '../components/FinishCart/UserData'
import SelectedPaymentData from '../components/FinishCart/SelectedPaymentData'
import DeliveryData from '../components/FinishCart/DeliveryData'
import { requestLogin } from '../services/navigationService'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import CartSummary from '../components/CartSummary/CartSummary'
import { navigate } from '../services/navigationService'
import CartItems from '../components/CartItems/CartItems'

export default function FinishCart() {
	const { cart, cardInfo, selectedPaymentData, startCart, cartIsLoading } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState({ state: false, message: '' })
	const [recaptchaIsReady, setRecaptchaIsReady] = useState(false)
	const [unavailableItems, setUnavailableItems] = useState([])

	const recaptchaRef = useRef()

	const RECAPTCHA_SITE_KEY = '6LcKXBMqAAAAAKsqevXXI4ZWr1enrPNrf25pmUs-'

	let captchaToken = null

	let interval

	const { t } = useTranslation()

	useEffect(() => {
		if (recaptchaIsReady) {
			;(async () => {
				captchaToken = await recaptchaRef?.current?.getRecaptchaToken()
				interval = setInterval(async () => {
					captchaToken = await recaptchaRef?.current?.getRecaptchaToken()
				}, 60000)
			})()
		}

		return () => clearInterval(interval)
	}, [recaptchaIsReady])

	useEffect(() => {
		if (cart && cart?.items?.length > 0) {
			const unavailableItems = cart?.items?.filter(item => item.availability !== 'available')
			if (unavailableItems.length > 0) {
				setUnavailableItems(unavailableItems)
			}
		}
		sendPageView('Checkout - Home')
	}, [cart])

	const navigateToEditor = (path, canOpenWithoutLogin) => {
		if (canOpenWithoutLogin) {
			Eitri.navigation.navigate({
				path: path
			})
		} else {
			requestLogin().then(async () => {
				const updatedCart = await startCart()
				if (updatedCart.canEditData) {
					Eitri.navigation.navigate({
						path: path,
						state: { cart: cart }
					})
				}
			})
		}
	}

	const runPaymentScript = async () => {
		try {
			setIsLoading(true)

			if (selectedPaymentData?.groupName === 'creditCardPaymentGroup' && !captchaToken) {
				captchaToken = await recaptchaRef?.current?.getRecaptchaToken()
			}

			const paymentResult = await startPayment(cart, cardInfo, captchaToken, RECAPTCHA_SITE_KEY)

			if (paymentResult.status === 'completed') {
				clearCart()
				Eitri.navigation.navigate('../OrderCompleted', {
					orderId: paymentResult.orderId,
					orderValue: cart.value
				})
				return
			}

			if (paymentResult?.paymentAuthorizationAppCollection?.[0]?.appName === 'vtex.pix-payment') {
				Eitri.navigation.navigate({ path: '../PixOrder', state: { paymentResult } })
				return
			}

			Eitri.navigation.navigate('../ExternalProviderOrder', { paymentResult })
		} catch (error) {
			setError({
				state: true,
				message: t('finishCart.errorOrder')
			})
		} finally {
			setIsLoading(false)
			const tenSeconds = 30000
			setTimeout(() => {
				setError({ state: false, message: '' })
			}, tenSeconds)
		}
	}

	return (
		<Page title='Checkout - Home'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('home.title')} />
			</HeaderContentWrapper>

			{(cartIsLoading || isLoading) && <Loading fullScreen />}

			<View
				topInset
				bottomInset
				className='p-4 pb-24'>
				{' '}
				{/* Adiciona padding-bottom para não sobrepor o botão */}
				<>
					{error.state && (
						<View className='flex flex-col gap-4 bg-negative-700 p-2 mb-2 rounded-sm'>
							<Text color='neutral-100'>{error.message}</Text>
						</View>
					)}

					{unavailableItems.length > 0 && (
						<View className='flex flex-col gap-4 bg-negative-700 p-2 mb-2 rounded-sm'>
							<Text color='neutral-100'>{t('finishCart.errorItems')}</Text>
						</View>
					)}

					<View className='flex flex-col gap-4'>
						{cart && <UserData />}

						<DeliveryData />

						{unavailableItems.length === 0 && (
							<SelectedPaymentData
								selectedPaymentData={selectedPaymentData}
								onPress={() => navigate('PaymentData', true)}
							/>
						)}

						<CartSummary />

						<CartItems />
					</View>
				</>
			</View>

			{/* Botão fixo na parte de baixo */}
			<View className='fixed bottom-0 left-0 w-full z-10 bg-base-100 p-4 border-t border-base-200'>
				<CustomButton
					label={t('finishCart.labelButton')}
					onPress={runPaymentScript}
				/>
			</View>

			<Recaptcha
				ref={recaptchaRef}
				siteKey={RECAPTCHA_SITE_KEY}
				onRecaptchaReady={() => setRecaptchaIsReady(true)}
			/>
		</Page>
	)
}
