import { getCart, addUserData, selectPaymentOption, removeClientData } from '../services/cartService'
import setFreight, { setNewAddress, updateAddress, setShippingAddress } from '../services/freigthService'

const LocalCart = createContext({})

export default function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [cartIsLoading, setCartIsLoading] = useState(null)
	const [selectedPaymentData, setSelectedPaymentData] = useState()
	const [cardInfo, setCardInfo] = useState()

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

	const _setFreight = async option => {
		return executeCartOperation(setFreight, option)
	}

	const _setNewAddress = async address => {
		return executeCartOperation(setNewAddress, address)
	}

	const addCustomerData = async (userData, orderFormId) => {
		return executeCartOperation(addUserData, userData, orderFormId)
	}

	const _selectPaymentOption = async payload => {
		return executeCartOperation(selectPaymentOption, payload)
	}

	const _setShippingAddress = async payload => {
		return executeCartOperation(setShippingAddress, payload)
	}

	const _removeClientData = async payload => {
		return executeCartOperation(removeClientData, payload)
	}

	return (
		<LocalCart.Provider
			value={{
				cart,
				setCart,
				addPersonalData,
				startCart,
				setFreight: _setFreight,
				setNewAddress: _setNewAddress,
				updateCartAddress,
				addCustomerData,
				selectPaymentOption: _selectPaymentOption,
				setShippingAddress: _setShippingAddress,
				removeClientData: _removeClientData,
				selectedPaymentData,
				setSelectedPaymentData,
				cartIsLoading,
				cardInfo,
				setCardInfo
			}}>
			{children}
		</LocalCart.Provider>
	)
}

export function useLocalShoppingCart() {
	const context = useContext(LocalCart)

	return context
}
