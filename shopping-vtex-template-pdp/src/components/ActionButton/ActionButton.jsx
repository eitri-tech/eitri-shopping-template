import { CustomButton } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { openCart } from '../../services/NavigationService'
import { formatAmount } from '../../utils/utils'
export default function ActionButton(props) {
	const { addItem, cart } = useLocalShoppingCart()
	const { t, i18n } = useTranslation()
	const { currentSku } = props
	const isAvailable = currentSku?.sellers[0]?.commertialOffer?.AvailableQuantity > 0
	const [isLoading, setLoading] = useState(false)
	const isItemOnCart = () => {
		return cart?.items?.some(cartItem => cartItem.id === currentSku?.itemId)
	}
	const getButtonLabel = () => {
		if (!isAvailable) return t('product.errorNoProduct')
		return isItemOnCart() ? t('product.labelGoToCart') : t('product.labelAddToCart')
	}
	const handleButtonClick = () => {
		if (!isAvailable) return
		setLoading(true)
		if (isItemOnCart()) {
			openCart()
		} else {
			addItem(currentSku)
		}
		setLoading(false)
	}
	return (
		<View className='flex px-8 items-center justify-center max-w-full'>
			<CustomButton
				onClick={handleButtonClick}
				isLoading={isLoading}
				backgroundColor={isAvailable ? 'primary-700' : 'neutral-300'}
				className='rounded-pill w-full'
				label={getButtonLabel()}
			/>
		</View>
	)
}
