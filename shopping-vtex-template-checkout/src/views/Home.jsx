import Eitri from 'eitri-bifrost'
import { addLoggedCustomerToCart, cartHasCustomerData, saveCartIdOnStorage } from '../services/cartService'
import { startConfigure } from '../services/AppService'
import { useCustomer } from '../providers/Customer'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { trackBeginCheckout, trackScreenView } from '../services/Tracking'
import { navigate } from '../services/navigationService'
import LoadingComponent from '../components/Shared/Loading/LoadingComponent'

let pristine = true
export default function Home(props) {
	const { startCart, addPersonalData, generateNewCart, addItem } = useLocalShoppingCart()
	const { getCustomer, getUserByEmail } = useCustomer()

	useEffect(() => {
		init()
	}, [])

	const init = async () => {
		try {
			await loadConfigs()
			const [loggedCustomer, cart] = await Promise.all([getCustomer(), loadCart()])

			let _cart = cart

			_cart = await assertNotNullGift(cart)

			if (loggedCustomer) {
				const cartEmail = cart?.clientProfileData?.email
				const customerEmail = loggedCustomer?.email
				if (cartEmail !== customerEmail || !cartHasCustomerData(cart)) {
					try {
						_cart = await addLoggedCustomerToCart(loggedCustomer, cart, { addPersonalData })
					} catch (e) {}
				}
			}

			loadCheckoutProfile(_cart?.clientProfileData?.email)
			handleNavigation(_cart)
		} catch (e) {
			console.log('Error ao buscar carrinho', e)
		}
	}

	const loadCart = async () => {
		const startParams = await Eitri.getInitializationInfos()

		if (startParams?.orderFormId) {
			await saveCartIdOnStorage(startParams?.orderFormId)
		}

		return await startCart()
	}

	const handleNavigation = async cart => {
		// navigate('CheckoutReview')
		// return
		// console.log('cart=====>', cart?.orderFormId)

		if (!cart || cart.items.length === 0) {
			trackScreenView(`checkout_home`, 'checkout.home')
			return navigate('EmptyCart')
		}

		if (pristine) {
			trackScreenView(`checkout_home`, 'checkout.home')
			trackBeginCheckout(cart)
			pristine = false
		}

		const destination = cartHasCustomerData(cart) ? 'FreightResolver' : 'PersonalData'
		console.log('destination', destination)
		return navigate(destination, {}, true)
	}

	const loadConfigs = async () => {
		try {
			await startConfigure()
		} catch (e) {
			console.log('Error ao buscar configurações', e)
		}
	}

	const loadCheckoutProfile = async email => {
		if (!email) return
		await getUserByEmail(email)
	}

	const assertNotNullGift = async cart => {
		const hasNullGift =
			cart?.paymentData?.giftCards?.length > 0 && cart?.paymentData?.giftCards?.some(gift => !gift.redemptionCode)
		if (hasNullGift) {
			// Nesse cenário o gift card nunca mais sai =/
			const currentItems = cart?.items?.map(item => item)

			let newCart = await generateNewCart()
			for (const item of currentItems) {
				newCart = await addItem({ ...item })
			}

			return newCart
		}

		return cart
	}

	return (
		<Page title={'Checkout'}>
			<LoadingComponent
				fullScreen={true}
				isLoading={true}
			/>
		</Page>
	)
}
