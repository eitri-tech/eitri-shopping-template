import { Page, View } from 'eitri-luminus'
import { useLocalShoppingCart } from '../providers/LocalCart'
import PaymentMethods from '../components/Methods/PaymentMethods'
import { trackScreenView } from '../services/Tracking'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'
import { HeaderContentWrapper, HeaderReturn, BottomInset } from 'shopping-vtex-template-shared'

export default function PaymentData(props) {
	const { cart, selectPaymentOption } = useLocalShoppingCart()

	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		trackScreenView(`checkout_dados_pagamento`, 'checkout.paymentData')
	}, [])

	const handlePaymentOptionsChange = async paymentMethod => {
		try {
			setIsLoading(true)
			const payload = {
				payments: Array.isArray(paymentMethod) ? paymentMethod : [paymentMethod],
				giftCards: cart.paymentData.giftCards
			}
			await selectPaymentOption(payload)
		} catch (error) {
			console.log('Erro ao selecionar método de pagamento', error)
		} finally {
			setIsLoading(false)
		}
	}

	if (!cart) {
		return
	}

	return (
		<Page title='Checkout - Dados de pagamento'>
			<HeaderContentWrapper>
				<HeaderReturn />
			</HeaderContentWrapper>

			<LoadingComponent
				fullScreen
				isLoading={isLoading}
			/>

			<View className='flex-1 p-4 flex flex-col gap-4'>
				<Text className='text-xl font-bold'>Escolha como pagar</Text>
				<PaymentMethods onSelectPaymentMethod={handlePaymentOptionsChange} />
			</View>

			<BottomInset />
		</Page>
	)
}
