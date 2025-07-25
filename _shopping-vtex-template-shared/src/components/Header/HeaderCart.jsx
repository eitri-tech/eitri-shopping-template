import { Text, View } from 'eitri-luminus'
import Eitri from 'eitri-bifrost'

export default function HeaderCart(props) {
	const { quantityOfItems, onClick, cart } = props

	const [_quantityOfItems, setQuantityOfItems] = useState(quantityOfItems ?? 0)

	useEffect(() => {
		if (cart) {
			const itemsQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0)
			setQuantityOfItems(itemsQuantity)
		}
	}, [cart])

	const handlePress = () => {
		if (onClick) {
			onClick()
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
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
					className='text-header-content'>
					<circle
						cx='9'
						cy='21'
						r='1'></circle>
					<circle
						cx='20'
						cy='21'
						r='1'></circle>
					<path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'></path>
				</svg>
			</View>

			{_quantityOfItems > 0 && (
				<View
					className={`absolute top-[-10px] right-[-10px] flex rounded-full w-5 h-5 justify-center items-center bg-header-content`}>
					<Text className='text-[12px] font-bold text-header-background'>{_quantityOfItems}</Text>
				</View>
			)}
		</View>
	)
}
