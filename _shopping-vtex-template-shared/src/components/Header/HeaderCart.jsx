import { Text, View } from 'eitri-luminus'
import Eitri from 'eitri-bifrost'

export default function HeaderCart(props) {
	const { quantityOfItems, onPress, cart } = props

	const [_quantityOfItems, setQuantityOfItems] = useState(quantityOfItems ?? 0)

	useEffect(() => {
		if (cart) {
			const itemsQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0)
			setQuantityOfItems(itemsQuantity)
		}
	}, [cart])

	const handlePress = () => {
		if (onPress) {
			onPress()
			return
		} else {
			Eitri.nativeNavigation.open({
				slug: 'cart'
			})
		}
	}

	return (
		<View className={`relative w-[25px] h-[25px] flex items-center`}>
			<View onClick={handlePress}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					height='24px'
					viewBox='0 -960 960 960'
					width='24px'
					className='text-[var(--header-content-color)]'
					fill='currentColor'>
					<path d='M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z' />
				</svg>
			</View>

			{_quantityOfItems > 0 && (
				<View
					className={`absolute top-[-10px] right-[-10px] flex rounded-full w-5 h-5 justify-center items-center bg-[var(--header-content-color)]`}>
					<Text className='text-[12px] font-bold text-[var(--header-background-color)]'>
						{_quantityOfItems}
					</Text>
				</View>
			)}
		</View>
	)
}
