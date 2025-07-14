import CartItem from '../CartItem/CartItem'
import { useLocalShoppingCart } from '../../providers/LocalCart'

export default function CartItemsContent(props) {
	const { cart, changeQuantity, removeItem, addItemOffer, removeItemOffer } = useLocalShoppingCart()

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

	const onAddOfferingToCart = async (itemIndex, offeringId) => {
		await addItemOffer(itemIndex, offeringId)
	}

	const onRemoveOfferingFromCart = async (itemIndex, offeringId) => {
		await removeItemOffer(itemIndex, offeringId)
	}

	return (
		<View className='px-4 flex flex-col gap-4'>
			{cart?.items?.map((item, index) => (
				<CartItem
					key={item.id}
					item={item}
					onChangeQuantityItem={newQuantity => onChangeQuantityItem(newQuantity, index)}
					message={hasMessage(item.ean)}
					handleRemoveCartItem={() => handleRemoveCartItem(index)}
					onAddOfferingToCart={offeringId => onAddOfferingToCart(index, offeringId)}
					onRemoveOfferingFromCart={offeringId => onRemoveOfferingFromCart(index, offeringId)}
				/>
			))}
		</View>
	)
}
