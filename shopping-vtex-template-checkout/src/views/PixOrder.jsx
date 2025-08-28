import Eitri from 'eitri-bifrost'
import { useEffect, useState } from 'react'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { Image, Page, Text, View } from 'eitri-luminus'
import { formatAmountInCents } from '../utils/utils'
import { clearCart, getPixStatus } from '../services/cartService'
import { trackScreenView } from '../services/Tracking'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	CustomButton,
	CustomInput,
	BottomInset
} from 'shopping-vtex-template-shared'

export default function PixOrder(props) {
	const [timeOut, setTimeOut] = useState(10 * 60)
	const [pixPayload, setPixPayload] = useState(null)
	const [showQRCode, setShowQRCode] = useState(false)

	let isMounted = true

	const { cart } = useLocalShoppingCart()

	useEffect(() => {
		trackScreenView(`checkout_pix`, 'checkout.pixOrder')
	}, [])

	useEffect(() => {
		const result = props.location?.state?.paymentResult

		if (result) {
			// console.log('result', result?.paymentAuthorizationAppCollection?.[0].appPayload)

			const appPayload = parseResponse(result?.paymentAuthorizationAppCollection?.[0].appPayload)

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
			Eitri.navigation.back()
		}
	}, [timeOut])

	function parseResponse(str) {
		try {
			// tenta parsear como JSON válido
			return JSON.parse(str)
		} catch (e) {
			// se falhar, extrai manualmente os campos que você precisa
			const codeMatch = str.match(/code:([^,}]*)/)
			const qrCodeMatch = str.match(/qrCodeBase64Image:([^,}]*)/)
			const paymentId = str.match(/paymentId:([^,}]*)/)
			const transactionId = str.match(/transactionId:([^,}]*)/)

			return {
				code: codeMatch ? codeMatch[1] : null,
				qrCodeBase64Image: qrCodeMatch ? qrCodeMatch[1] : null,
				paymentId,
				transactionId
			}
		}
	}

	const copyCode = async () => {
		Eitri.clipboard.setText({
			text: pixPayload.code
		})
	}

	const shareCode = async () => {
		await Eitri.share.link({
			url: `${pixPayload.code}`
		})
	}

	const toggleQRCode = () => {
		setShowQRCode(!showQRCode)
	}

	const formatTime = seconds => {
		let minutes = Math.floor(seconds / 60)
		let remainingSeconds = seconds % 60
		return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
	}

	async function checkPixStatus(transactionId, paymentId) {
		try {
			if (!isMounted) return
			const result = await getPixStatus(transactionId, paymentId)
			if (!result) return
			if (result.status === 'waiting') {
				await new Promise(resolve => setTimeout(resolve, 10000))
				await checkPixStatus(transactionId, paymentId)
			} else {
				clearCart()
				navigate('OrderCompleted', { orderId: result?.orderId })
			}
		} catch (error) {}
	}

	// Call the function to start fetching data

	if (!pixPayload) return null

	return (
		<Page title='Pix QR Code'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Pagamento PIX'} />
			</HeaderContentWrapper>

			<View className='p-4 flex flex-col gap-4'>
				{/* Informação sobre PIX */}
				<View className='flex items-center gap-3 bg-white rounded p-4'>
					<View className='text-primary'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='16'
							height='16'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'>
							<circle
								cx='12'
								cy='12'
								r='10'></circle>
							<polyline points='12 6 12 12 16 14'></polyline>
						</svg>
					</View>
					<Text className='text-base-content/70 font-medium'>Com o PIX, sua compra é aprovada na hora</Text>
				</View>

				{/* Valor do pagamento */}
				<View className='bg-white rounded p-4'>
					<Text className='text-base-content/70'>
						Valor da compra: <Text className='font-bold'>{formatAmountInCents(cart.value)}</Text>
					</Text>
				</View>

				{/* Código PIX */}
				<View className='bg-white rounded p-4'>
					<Text className='text-base font-semibold mb-3 text-base-content'>Código PIX</Text>
					<CustomInput
						value={pixPayload.code}
						disabled
						className='w-full rounded bg-base-100 border-base-300 mt-2'
					/>
				</View>

				<View className='flex flex-col gap-2'>
					{/* Botões de ação */}
					<View className='flex flex-row gap-2'>
						<CustomButton
							label='Copiar código'
							className='flex-1'
							onPress={copyCode}
						/>
						<CustomButton
							label='Compartilhar'
							className='flex-1'
							onPress={shareCode}
						/>
					</View>

					{/* Botão para mostrar/ocultar QR Code */}
					<CustomButton
						label={showQRCode ? 'Ocultar QR Code' : 'Mostrar QR Code'}
						className='w-full'
						onPress={toggleQRCode}
					/>
				</View>

				{/* QR Code */}
				{showQRCode && (
					<View className='flex items-center justify-center gap-4'>
						<View className='bg-white p-4 rounded shadow-lg'>
							<Image
								src={`data:image;base64,${pixPayload.qrCodeBase64Image}`}
								className='w-48 h-48'
							/>
						</View>
					</View>
				)}

				{/* Instruções */}
				<View className='bg-white rounded p-4'>
					<Text className='text-lg font-bold mb-3 text-base-content'>Como pagar com PIX</Text>
					<View className='flex flex-col gap-2 mt-2'>
						<View className='flex flex-row items-center'>
							<Text className='text-base-content/70'>• Acesse seu Internet Banking</Text>
						</View>
						<View className='flex flex-row items-center'>
							<Text className='text-base-content/70'>• Escolha o pagamento via PIX</Text>
						</View>
						<View className='flex flex-row items-center'>
							<Text className='text-base-content/70'>• Cole o código acima</Text>
						</View>
					</View>
				</View>

				{/* Timer */}
				<View className='flex items-center justify-center'>
					<Text className='text-base-content/70 text-sm text-center'>
						Tempo restante: <Text className='font-semibold'>{formatTime(timeOut)}</Text>
					</Text>
				</View>

				{/* Informações adicionais */}
				<View className='px-4'>
					<Text className='block text-sm text-base-content/70 text-center'>
						O pagamento será processado automaticamente após a confirmação
					</Text>
				</View>
			</View>

			<BottomInset />
		</Page>
	)
}
