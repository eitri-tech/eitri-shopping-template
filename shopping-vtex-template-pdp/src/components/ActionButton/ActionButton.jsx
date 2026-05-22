import { CustomButton, BottomInset, TrackingService } from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { openCart } from '../../services/NavigationService'

import { useSnackBar } from '../../providers/SnackBar'

export default function ActionButton(props) {
	const { addItem, cart, changeItemQuantity } = useLocalShoppingCart()
	const { showSnackBar } = useSnackBar()
	const { currentSku, selectedBuyTogetherSkus = [], product } = props
	const [isAvailable, setIsAvailable] = useState(true)
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		const mainSeller = currentSku?.sellers?.find(seller => seller.sellerDefault)
		const isAvailable = mainSeller?.commertialOffer?.AvailableQuantity > 0
		setIsAvailable(isAvailable)
	}, [currentSku])

	const addOrIncreaseCartItem = async () => {
		const itemIndexOnCart = cart?.items?.findIndex(item => item.id === currentSku?.itemId)

		if (itemIndexOnCart > -1) {
			const currentCartQuantity = cart?.items[itemIndexOnCart]?.quantity || 0
			await changeItemQuantity(itemIndexOnCart, currentCartQuantity + 1)
		} else {
			await addItem({ ...currentSku, quantity: 1 })
		}

		TrackingService.addToCartEvent(product)
		showSnackBar('success', 'adicionado à cesta com sucesso')
	}

	const handleButtonClick = async () => {
		if (!isAvailable || isLoading) return

		setLoading(true)

		try {
			// TODO: Mudar para adicionar o array com todos de uma vez
			await addOrIncreaseCartItem(currentSku)

			for (const sku of selectedBuyTogetherSkus) {
				await addItem({ ...sku, quantity: 1 })
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<View className='fixed bottom-0 left-0 right-0 z-[999] bg-white rounded-t-2xl'>
				<View className='p-4 flex items-center  gap-2'>
					<CustomButton
						onClick={handleButtonClick}
						isLoading={isLoading}
						label={'Comprar'}
						disabled={!isAvailable}
					/>
				</View>

				<BottomInset />
			</View>
			<View>
				<View className='h-[77px] w-full' />
			</View>
		</>
	)
}
