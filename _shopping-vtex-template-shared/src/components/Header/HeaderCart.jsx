import { Text, View} from "eitri-luminus";
export default function HeaderCart(props) {
  const { quantityOfItems, textColor, iconColor, onPress, cart } = props

  const [_quantityOfItems, setQuantityOfItems] = useState(quantityOfItems ?? 0)


  useEffect(() => {
    if (cart) {
     const itemsQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0)
     // setQuantityOfItems(itemsQuantity)
     setQuantityOfItems(2)
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
			<Button className="btn bg-transparent border-transparent flex items-center px-0 shadow-none pb-0" onClick={handlePress}>
        <View className='material-symbols-outlined header-content-color text-[28px]'>shopping_cart</View>
			</Button>

			{quantityOfItems > 0 && (
				<View className={`absolute top-[-10px] right-[-10px] flex rounded-full w-5 h-5 justify-center items-center`}
					>
					<Text
            className='text-[12px] font-bold header-content-color'>
						{quantityOfItems}
					</Text>
				</View>
			)}
		</View>
	)
}
