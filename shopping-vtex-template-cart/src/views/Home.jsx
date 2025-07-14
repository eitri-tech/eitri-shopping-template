import Eitri from 'eitri-bifrost'
import { sendPageView } from '../services/trackingService'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { HeaderContentWrapper, HeaderReturn, HeaderText, Loading } from 'shopping-vtex-template-shared'
import { saveCartIdOnStorage } from '../services/cartService'
import Freight from '../components/Freight/Freight'
import Coupon from '../components/Coupon/Coupon'
import CartSummary from '../components/CartSummary/CartSummary'
import InstallmentsMsg from '../components/InstallmentsMsg/InstallmentsMsg'
import CartItemsContent from '../components/CartItemsContent/CartItemsContent'
import { startConfigure } from '../services/AppService'
import { Page } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'

export default function Home(props) {
	const { t } = useTranslation()
	const { cart, startCart } = useLocalShoppingCart()

	const [appIsLoading, setAppIsLoading] = useState(true)
	const [openWithBottomBar, setOpenWithBottomBar] = useState(false)

	useEffect(() => {
		startHome()
		Eitri.navigation.setOnResumeListener(() => {
			startHome()
		})
	}, [])

	useEffect(() => {
		if (cart && cart.items.length === 0) {
			Eitri.navigation.navigate({
				path: 'EmptyCart',
				state: { showCloseButton: !openWithBottomBar },
				replace: true
			})
		}
	}, [cart])

	const startHome = async () => {
		const startParams = await Eitri.getInitializationInfos()
		setOpenWithBottomBar(startParams?.tabIndex)

		await startConfigure()
		await loadCart()

		setAppIsLoading(false)
		sendPageView('Home')
	}

	const loadCart = async () => {
		const startParams = await Eitri.getInitializationInfos()
		if (startParams?.orderFormId) {
			await saveCartIdOnStorage(startParams?.orderFormId)
		}
		return startCart()
	}

	return (
		<Page title='Carrinho'>
			<HeaderContentWrapper
				gap={16}
				scrollEffect={false}>
				{!openWithBottomBar && <HeaderReturn />}

				<HeaderText text={t('home.title')} />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={appIsLoading}
			/>

			<View bottomInset={'auto'}>
				<CartItemsContent />

				<Freight />

				<Coupon />

				<CartSummary />
			</View>
		</Page>
	)
}
