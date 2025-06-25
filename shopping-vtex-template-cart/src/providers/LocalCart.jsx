import setFreight, { setNewAddress } from '../services/freigthService'
import {
	getCart,
	cardAdaptation,
	addCoupon,
	addItemOffer,
	addItemToCart,
	changeItemQuantity,
	removeCartItem,
	removeCoupon,
	removeItemOffer
} from '../services/cartService'

const LocalCart = createContext({})

export default function CartProvider({ children }) {
	const [cart, setCart] = useState(null)
	const [cartIsLoading, setCartInLoading] = useState(null)

	const executeCartOperation = async (operation, ...args) => {
		setCartInLoading(true)
		const newCart = await operation(...args)
		if (newCart) {
			const adaptedCart = cardAdaptation(newCart)
			setCart(adaptedCart)
		}
		setCartInLoading(false)
	}

	const startCart = async () => {
		return executeCartOperation(getCart)
	}

	const addItem = async payload => {
		return executeCartOperation(addItemToCart, payload)
	}

	const addOffering = async (orderFormId, itemIndex, offeringId) => {
		return executeCartOperation(addItemOffer, orderFormId, itemIndex, offeringId)
	}

	const removeOffering = async (orderFormId, itemIndex, offeringId) => {
		return executeCartOperation(removeItemOffer, orderFormId, itemIndex, offeringId)
	}

	const changeQuantity = async (index, newQuantity) => {
		return executeCartOperation(changeItemQuantity, index, newQuantity)
	}

	const removeItem = async index => {
		return executeCartOperation(removeCartItem, index)
	}

	const changeCartAddress = async (cart, zipCode) => {
		return executeCartOperation(setNewAddress, cart, zipCode)
	}

	const updateCartFreight = async (cart, option) => {
		return executeCartOperation(setFreight, cart, option)
	}

	const applyCouponToCart = async coupon => {
		return executeCartOperation(addCoupon, coupon)
	}

	const removeCouponToCart = async () => {
		return executeCartOperation(removeCoupon)
	}

	return (
		<LocalCart.Provider
			value={{
				setCart,
				startCart,
				cart,
				cartIsLoading,
				addItem,
				addOffering,
				removeOffering,
				changeQuantity,
				removeItem,
				changeCartAddress,
				updateCartFreight,
				applyCouponToCart,
				removeCouponToCart
			}}>
			{children}
		</LocalCart.Provider>
	)
}

export function useLocalShoppingCart() {
	const context = useContext(LocalCart)

	return context
}
