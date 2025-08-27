import pixImg from '../assets/images/pix.png'
import Eitri from 'eitri-bifrost'
import { CustomButton } from 'shopping-vtex-template-shared'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { clearCart } from '../services/cartService'
import { useLocalShoppingCart } from '../providers/LocalCart'

export default function PixOrder(props) {
	const PAGE = 'Pix'

	const [timeOut, setTimeOut] = useState(10 * 60)

	const [pixPayload, setPixPayload] = useState(null)

	let isMounted = true

	const { cart } = useLocalShoppingCart()

	useEffect(() => {
		if (props.location?.state?.paymentResult) {
			const result = props.location?.state?.paymentResult

			const appPayload = JSON.parse(result?.paymentAuthorizationAppCollection?.[0].appPayload)

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
	}, [props.location?.state?.paymentResult])

	useEffect(() => {
		if (timeOut <= 0) {
			Eitri.navigation.navigate({ path: 'FinishCart', replace: true })
		}
	}, [timeOut])

	useEffect(() => {
		checkPixStatus()
	}, [pixPayload])

	const copyCode = async () => {
		Eitri.clipboard.setText({
			text: pixPayload.code
		})
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
				navigate('OrderCompleted', {
					orderId: result?.orderId,
					orderValue: cart.value
				})
			}
		} catch (error) {}
	}

	// Call the function to start fetching data

	if (!pixPayload) return null

	return (
		<Page title='Pix QR Code'>
			<View
				topInset
				bottomInset
				className='flex flex-col justify-center items-center min-h-screen p-4 gap-5'>
				<View className='flex flex-col justify-center items-center gap-3'>
					<Image
						src={pixImg}
						className='w-1/2'
					/>
					<Text>Tempo restante&nbsp;{formatTime(timeOut)}</Text>
				</View>

				<View className='flex flex-col justify-center items-center'>
					<Image
						src={`data:image;base64,${pixPayload.qrCodeBase64Image}`}
						className='w-[70%]'
					/>
				</View>

				<View className='max-w-full rounded-sm p-2 border border-neutral-500 border-opacity-50'>
					<Text className='break-words max-w-full'>{pixPayload.code}</Text>
				</View>

				<CustomButton
					label='Copiar código'
					className='w-full'
					onPress={copyCode}
				/>
			</View>
		</Page>
	)
}
