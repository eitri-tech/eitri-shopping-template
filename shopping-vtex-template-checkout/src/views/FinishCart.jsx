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

export default function FinishCart() {
	const { cart, selectedPaymentData, startCart, cartIsLoading } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState({ state: false, message: '' })
	const [recaptchaIsReady, setRecaptchaIsReady] = useState(false)
	const [currencyProps, setCurrencyProps] = useState({})
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

	useEffect(() => {
		configLanguage()
	}, [])

	const configLanguage = async () => {
		try {
			const remoteConfig = await Eitri.environment.getRemoteConfigs()
			const locale = remoteConfig?.storePreferences?.locale || 'pt-BR'
			const currency = remoteConfig?.storePreferences?.currencyCode || 'BRL'

			setCurrencyProps({ locale, currency })
		} catch (e) {
			console.error('Erro ao buscar configurações', e)
		}
	}

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

			const paymentResult = await startPayment(selectedPaymentData, captchaToken, RECAPTCHA_SITE_KEY)

			if (paymentResult.status === 'completed') {
				clearCart()
				Eitri.navigation.navigate({ path: '../OrderCompleted', state: { orderId: paymentResult.orderId } })
			}

			if (paymentResult.status === 'waiting_pix_payment') {
				Eitri.navigation.navigate({ path: '../PixOrder', state: { pixData: paymentResult.pixData } })
			}
		} catch (error) {
			console.log('Erro no runPaymentScript', error)
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
		<Page
			title='Checkout - Home'
			topInset
			bottomInset>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('home.title')} />
			</HeaderContentWrapper>

			{(cartIsLoading || isLoading) && <Loading fullScreen />}

			<View className='p-4'>
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

					<CartSummary />

					<View className='flex flex-col gap-4'>
						{cart && <UserData onPress={() => navigateToEditor('PersonalData', cart?.canEditData)} />}

						<DeliveryData onPress={() => navigateToEditor('AddressSelector', cart?.canEditData)} />

						{unavailableItems.length === 0 && (
							<SelectedPaymentData
								payments={cart?.payments}
								selectedPaymentData={selectedPaymentData}
								onPress={() => navigateToEditor('PaymentData', true)}
							/>
						)}
					</View>

					{/*<>*/}
					{/*	<View className='h-[90px]' />*/}
					{/*	<View className='bg-background-color fixed bottom-0 left-0 right-0'>*/}
					{/*		<View className='p-4 flex flex-col items-center justify-center'>*/}
					{/*			<CustomButton*/}
					{/*				borderRadius='pill'*/}
					{/*				marginVertical='small'*/}
					{/*				label={t('finishCart.labelButton')}*/}
					{/*				fontSize='medium'*/}
					{/*				backgroundColor='primary-500'*/}
					{/*				block*/}
					{/*				onPress={runPaymentScript}*/}
					{/*			/>*/}
					{/*		</View>*/}

					{/*		<View className='w-full bottomInset' />*/}
					{/*	</View>*/}
					{/*</>*/}
				</>
			</View>

			<Recaptcha
				ref={recaptchaRef}
				siteKey={RECAPTCHA_SITE_KEY}
				onRecaptchaReady={() => setRecaptchaIsReady(true)}
			/>
		</Page>
	)
}
