import CartItem from '../CartItem/CartItem'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function CartItemsContent(props) {
	const { cart, changeQuantity, removeItem } = useLocalShoppingCart()

	const hasMessage = itemEan => {
		let message = cart.messages.filter(item => item.code === 'withoutStock' && item.fields.ean == itemEan)
		return message[0] || null
	}

	const onChangeQuantityItem = async (quantity, index) => {
		try {
			changeQuantity(index, quantity)
		} catch (e) {
			console.erro('Error onChangeQuantityItem==>', e)
		}
	}

	const handleRemoveCartItem = async index => {
		try {
			removeItem(index)
		} catch (error) {
			console.error('Cart: handleRemoveCartItem Error', error)
		}
	}

	const onAddOfferingToCart = async (itemIndex, offeringId) => {}

	const onRemoveOfferingFromCart = async (itemIndex, offeringId) => {}

	return (
		<View className='px-4'>
			{cart?.items?.map(item => (
				<CartItem
					key={item.id}
					onChangeQuantityItem={onChangeQuantityItem}
					item={item}
					message={hasMessage(item.ean)}
					handleRemoveCartItem={handleRemoveCartItem}
					onAddOfferingToCart={onAddOfferingToCart}
					onRemoveOfferingFromCart={onRemoveOfferingFromCart}
				/>
			))}
		</View>
	)
}
