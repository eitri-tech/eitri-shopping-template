import { getCart, addUserData, selectPaymentOption } from '../services/cartService'
import setFreight, { setNewAddress, updateAddress } from '../services/freigthService'

const LocalCart = createContext({})

export default function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [cartIsLoading, setCartIsLoading] = useState(null)
	const [selectedPaymentData, setSelectedPaymentData] = useState()

	const executeCartOperation = async (operation, ...args) => {
		setCartIsLoading(true)
		const newCart = await operation(...args)
		setCart(newCart)
		setCartIsLoading(false)
		return newCart
	}

	const startCart = async () => {
		return executeCartOperation(getCart)
	}

	const addPersonalData = async (userData, orderFormId) => {
		return executeCartOperation(addUserData, userData, orderFormId)
	}

	const updateCartAddress = async (cart, zipCode) => {
		return executeCartOperation(updateAddress, cart, zipCode)
	}

	const updateCartFreight = async (cart, option) => {
		return executeCartOperation(setFreight, cart, option)
	}

	const setNewAddressToCart = async (cart, address) => {
		return executeCartOperation(setNewAddress, cart, address)
	}

	const addCustomerData = async (userData, orderFormId) => {
		return executeCartOperation(addUserData, userData, orderFormId)
	}

	const setPaymentOption = async payload => {
		return executeCartOperation(selectPaymentOption, payload)
	}

	return (
		<LocalCart.Provider
			value={{
				cart,
				setCart,
				cardInfo: {},
				addPersonalData,
				startCart,
				updateCartFreight,
				setNewAddressToCart,
				updateCartAddress,
				addCustomerData,
				setPaymentOption,
				selectedPaymentData,
				setSelectedPaymentData,
				cartIsLoading
			}}>
			{children}
		</LocalCart.Provider>
	)
}

export function useLocalShoppingCart() {
	const context = useContext(LocalCart)

	return context
}
