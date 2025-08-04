import Eitri from 'eitri-bifrost'
import { useLocalShoppingCart } from '../providers/LocalCart'
import {
	CustomButton,
	BottomInset,
	Loading,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText
} from 'shopping-vtex-template-shared'
import { clearCart, startPayment } from '../services/cartService'
import Recaptcha from '../services/Recaptcha'
import UserData from '../components/FinishCart/UserData'
import SelectedPaymentData from '../components/FinishCart/SelectedPaymentData'
import DeliveryData from '../components/FinishCart/DeliveryData'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import CartSummary from '../components/CartSummary/CartSummary'
import { navigate } from '../services/navigationService'
import { requestLogin } from '../services/customerService'

export default function FinishCart() {
	const { cart, cardInfo, selectedPaymentData, cartIsLoading, removeCartItem } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState({ state: false, message: '' })
	const [recaptchaIsReady, setRecaptchaIsReady] = useState(false)
	const [unavailableItems, setUnavailableItems] = useState([])

	const recaptchaRef = useRef()

	const RECAPTCHA_SITE_KEY = '6LcKXBMqAAAAAKsqevXXI4ZWr1enrPNrf25pmUs-'

	let captchaToken = null

	let interval

	useEffect(() => {
		sendPageView('Checkout - Home')
	}, [])

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
			} else {
				setUnavailableItems([])
			}
		}
	}, [cart])

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
			const errorCode = error.response?.data?.error?.code
			if (errorCode === 'CHK003' || errorCode === 'CHK0087') {
				try {
					await requestLogin()
					await runPaymentScript()
				} catch (e) {}
			}

			setError({
				state: true,
				message: error.response?.data?.error?.message
			})

			setIsLoading(false)
			const tenSeconds = 30000
			setTimeout(() => {
				setError({ state: false, message: '' })
			}, tenSeconds)
		}
	}

	const isReadyToPay = () => {
		return (
			unavailableItems.length === 0 &&
			cart?.items?.length > 0 &&
			cart?.shippingData?.address &&
			cart?.shippingData?.address?.number
		)
	}

	const removeUnavailableItem = async uItem => {
		try {
			setIsLoading(true)
			const index = cart.items.findIndex(item => item.uniqueId === uItem.uniqueId)
			await removeCartItem(index)
			setIsLoading(false)
		} catch (e) {
			console.error('Error on removeUnavailableItem', e)
			setIsLoading(false)
		}
	}

	return (
		<Page title='Checkout - Home'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('home.title')} />
			</HeaderContentWrapper>

			{(cartIsLoading || isLoading) && <Loading fullScreen />}

			<View className='p-4'>
				{/* Adiciona padding-bottom para não sobrepor o botão */}
				<>
					{error.state && (
						<View className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
							<Text color='text-sm text-red-600 font-medium'>
								{error.message || 'Houve um erro ao fechar o pedido'}
							</Text>
						</View>
					)}

					{unavailableItems.length > 0 && (
						<View className='mb-4 p-4 bg-red-50 border border-red-200 rounded'>
							<Text className='text-sm text-red-600 font-medium'>{t('finishCart.errorItems')}</Text>

							{unavailableItems.map(uItem => (
								<View
									className='flex items-center justify-between gap-2 mt-2'
									key={uItem.uniqueId}>
									<View className='flex items-center gap-2'>
										<Image
											src={uItem.imageUrl}
											className='w-[60px] rounded'
										/>
										<Text className='text-sm font-medium'>{uItem.name}</Text>
									</View>
									<View onClick={() => removeUnavailableItem(uItem)}>
										<Text className='text-sm text-red-600 font-medium'>Excluir</Text>
									</View>
								</View>
							))}
						</View>
					)}

					<View className='flex flex-col gap-4'>
						<CartSummary />

						{cart && <UserData />}

						{unavailableItems.length === 0 && (
							<>
								<DeliveryData />

								<SelectedPaymentData
									selectedPaymentData={selectedPaymentData}
									onPress={() => navigate('PaymentData', true)}
								/>
							</>
						)}
					</View>
				</>
			</View>

			{/* Botão fixo na parte de baixo */}
			<View>
				<View className='fixed bottom-0 left-0 w-full z-10 bg-white border-t border-gray-300'>
					<View className='p-4'>
						<CustomButton
							disabled={!isReadyToPay()}
							label={t('finishCart.labelButton')}
							onPress={runPaymentScript}
						/>
					</View>
					<BottomInset />
				</View>

				<View className='h-[50px] w-full' />
			</View>

			<BottomInset />

			<Recaptcha
				ref={recaptchaRef}
				siteKey={RECAPTCHA_SITE_KEY}
				onRecaptchaReady={() => setRecaptchaIsReady(true)}
			/>
		</Page>
	)
}
