import { Page, View, Text, Image } from 'eitri-luminus'
import pixImg from '../assets/images/pix.png'
import Eitri from 'eitri-bifrost'
import { sendPageView, logEvent } from '../services/trackingService'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { CustomButton } from 'shopping-vtex-template-shared'
import { clearCart } from '../services/cartService'
import { useTranslation } from 'eitri-i18n'

export default function PixOrder(props) {
	const [timeOut, setTimeOut] = useState(10 * 60)

	const [pixPayload, setPixPayload] = useState(null)

	let isMounted = true

	const { t } = useTranslation()

	useEffect(() => {
		if (props.location?.state?.pixData) {
			const appPayload = JSON.parse(props.location?.state?.pixData)

			setPixPayload(appPayload)

			checkPixStatus(appPayload.transactionId, appPayload.paymentId)

			const interval = setInterval(() => {
				setTimeOut(prev => prev - 1)
			}, 1000)

			return () => {
				isMounted = false
				clearInterval(interval)
			}
		}
	}, [props.location?.state?.pixData])

	useEffect(() => {
		if (timeOut <= 0) {
			Eitri.navigation.navigate({ path: 'Checkout/FinishCart' })
			return
		}
	}, [timeOut])

	useEffect(() => {
		checkPixStatus()
	}, [pixPayload])

	useEffect(() => {
		sendPageView(`PixOrder`, 'PixOrder')
	}, [])
	const copyCode = async () => {
		Eitri.clipboard.setText({
			text: pixPayload.code
		})
		await logEvent('CopyPixCode', { ...pixPayload })
	}

	const formatTime = seconds => {
		let minutes = Math.floor(seconds / 60)
		let remainingSeconds = seconds % 60
		return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	}

	async function checkPixStatus(transactionId, paymentId) {
		try {
			if (!isMounted) return

			const result = await Vtex.checkout.getPixStatus(transactionId, paymentId)

			if (result.status === 'waiting') {
				await new Promise(resolve => setTimeout(resolve, 10000))
				await checkPixStatus(transactionId, paymentId)
			} else {
				clearCart()
				Eitri.navigation.navigate({ path: 'OrderCompleted', state: { orderId: result?.orderId } })
			}
		} catch (error) {
			console.error('Error fetching data:', error)
		}
	}

	// Call the function to start fetching data

	if (!pixPayload) return null

	return (
		<Page
			topInset
			bottomInset>
			<View className='flex flex-col justify-center items-center min-h-screen p-small gap-5'>
				<View className='flex flex-col justify-center items-center gap-2\.5'>
					<Image
						src={pixImg}
						className='w-1/2'
					/>
					<Text>
						{t('pixOrder.txtTimeRemaining')}&nbsp;{formatTime(timeOut)}
					</Text>
				</View>

				<View className='flex flex-col justify-center items-center'>
					<Image
						src={pixPayload.qrCodeBase64Image}
						className='w-[70%]'
					/>
				</View>

				<View className='max-w-full rounded-sm p-extra-small border border-neutral-500 border-hairline'>
					<Text className='break-words max-w-full'>{pixPayload.code}</Text>
				</View>

				<CustomButton
					borderRadius='pill'
					label={t('pixOrder.labelCopyCode')}
					onPress={copyCode}
				/>
			</View>
		</Page>
	)
}
