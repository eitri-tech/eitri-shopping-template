import { openProduct } from '../../services/NavigationService'
import { removeFromWishlist } from '../../services/CustomerService'
import { formatPrice } from '../../utils/utils'
import { App } from 'eitri-shopping-vtex-shared'
import { ProductCardFullImage, ProductCardDefault } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'

export default function ProductCard(props) {
	/*
	 *  Aos poucos modificando esse componente para quebrar ele em mais componentes funcionais
	 * */

	const { t } = useTranslation()
	const { product, className } = props

	const [loadingCartOp, setLoadingCartOp] = useState(false)
	const [loadingWishlistOp, setLoadingWishlistOp] = useState(true)

	const [isOnWishlist, setIsOnWishlist] = useState(false)
	const [wishListId, setWishListId] = useState(null)

	const [itemQuantity, setItemQuantity] = useState(1)
	const [itemInCart, setItemInCart] = useState(null)

	const item = product?.items?.[0]
	const sellerDefault = item?.sellers?.find(seller => seller.sellerDefault) || item?.sellers?.[0]

	useEffect(() => {}, [])

	const getItemName = () => {
		if (item) {
			return item?.nameComplete || item?.name
		}
	}

	const getItemImage = () => {
		if (item) {
			return item?.images?.[0]?.imageUrl
		}
	}

	const getItemVideo = () => {
		if (item) {
			let productVideo = ''
			if (App?.configs?.appConfigs?.productCard?.productVideoTag) {
				const productVideoTag = App?.configs?.appConfigs?.productCard?.productVideoTag
				const property = product?.properties?.find(prop => prop.name === productVideoTag)
				if (property) {
					productVideo = property.values?.[0]
				}
			}
		}
	}

	// Formatters
	const formatInstallments = seller => {
		const installments = seller?.commertialOffer.Installments

		const maxInstallments = installments?.reduce((acc, curr) => {
			return curr.NumberOfInstallments > acc.NumberOfInstallments ? curr : acc
		}, installments[0])

		if (!maxInstallments || maxInstallments?.NumberOfInstallments === 1) return ''

		return `em até ${maxInstallments?.NumberOfInstallments}x ${formatPrice(maxInstallments?.Value)}`
	}

	const getListPrice = () => {
		if (sellerDefault?.commertialOffer.Price === sellerDefault?.commertialOffer.ListPrice) {
			return ''
		} else {
			return formatPrice(sellerDefault?.commertialOffer.ListPrice)
		}
	}

	const getBadge = () => {
		const price = sellerDefault?.commertialOffer?.Price
		const listPrice = sellerDefault?.commertialOffer?.ListPrice

		if (price !== listPrice) {
			const discount = ((listPrice - price) / listPrice) * 100
			return `${discount.toFixed(0)}% OFF`
		} else {
			return ''
		}
	}

	// Cart
	const addToCart = async () => {
		try {
			setLoadingCartOp(true)
			const newCart = await addItem({ ...item, quantity: itemQuantity })
			const itemIndex = newCart?.items?.find(cartItem => cartItem.id === item?.itemId)
			if (itemIndex > -1) {
				setItemInCart({ ...cart?.items?.[itemIndex], index: itemIndex })
				setItemQuantity(cart?.items?.[itemIndex].quantity)
			}
			setLoadingCartOp(false)
		} catch (e) {
			console.error('Error adding cart item', e)
			setLoadingCartOp(false)
		}
	}

	const removeFromCart = async () => {
		setLoadingCartOp(true)
		const index = cart?.items?.findIndex(cartItem => cartItem.id === item?.itemId)
		await removeItem(index)
		setItemInCart(null)
		setLoadingCartOp(false)
	}

	const isItemOnCart = () => {
		return !!itemInCart
	}

	const onChangeQuantity = async newQuantity => {
		if (newQuantity === 0) {
			return removeFromCart()
		}
		if (itemInCart) {
			await updateItemQuantity(itemInCart.index, newQuantity)
			setItemQuantity(newQuantity)
		}
	}

	// Wishlist
	const onAddToWishlist = async () => {
		try {
			if (!product.productId) return
			setLoadingWishlistOp(true)
			setIsOnWishlist(true)
			let response = await addToWishlist(product.productId, item?.name, item?.itemId)
			setWishListId(response?.data?.addToList)
			setLoadingWishlistOp(false)
		} catch (error) {
			Tracking.error(error, 'home.productCard.onAddToWishlist')
			setIsOnWishlist(false)
			setLoadingWishlistOp(false)
		}
	}

	const onRemoveFromWishlist = async () => {
		try {
			setLoadingWishlistOp(true)
			setIsOnWishlist(false)
			await removeFromWishlist(wishListId)
			setLoadingWishlistOp(false)
		} catch (error) {
			setLoadingWishlistOp(false)
			setIsOnWishlist(true)
			Tracking.error(error, 'home.productCard.onRemoveFromWishlist')
		}
	}

	// Navigation
	const onPressOnCard = () => {
		openProduct(product)
	}

	const onPressOnWishlist = () => {
		onRemoveFromWishlist()
	}

	const onPressCartButton = () => {
		if (App?.configs?.appConfigs?.productCard?.buyGoesToPDP) {
			openProduct(product)
			return
		}
		if (loadingCartOp) return
		if (isItemOnCart()) {
			removeFromCart()
		} else {
			addToCart()
		}
	}

	let productVideo = ''
	if (App?.configs?.appConfigs?.productCard?.productVideoTag) {
		const productVideoTag = App?.configs?.appConfigs?.productCard?.productVideoTag
		const property = product?.properties?.find(prop => prop.name === productVideoTag)
		if (property) {
			productVideo = property.values?.[0]
		}
	}

	const params = {
		name: getItemName(),
		image: getItemImage(),
		video: productVideo,
		badge: getBadge(),
		listPrice: getListPrice(),
		showListItem: App?.configs?.appConfigs?.productCard?.showListPrice ?? true,
		price: formatPrice(sellerDefault?.commertialOffer.Price),
		installments: formatInstallments(sellerDefault),
		isInCart: isItemOnCart(),
		isOnWishlist: true,
		loadingWishlistOp: loadingWishlistOp,
		loadingCartOp: loadingCartOp,
		itemQuantity: itemQuantity,
		actionLabel: 'Comprar',
		onPressOnCard: onPressOnCard,
		onPressCartButton: onPressCartButton,
		onPressOnWishlist: onPressOnWishlist,
		onChangeQuantity: onChangeQuantity,
		t: t,
		className
	}

	const implementations = {
		fullImage: ProductCardFullImage,
		default: ProductCardDefault
		// convenience: ProductCardConvenience
	}

	const rcProductCardStyle = App?.configs?.appConfigs?.productCard?.style

	const Implementation =
		rcProductCardStyle && implementations[rcProductCardStyle]
			? implementations[rcProductCardStyle]
			: ProductCardDefault

	/*prettier-ignore*/
	return React.createElement(Implementation, params)
}
