import ProductCardWrapper from '../ProductCardWrapper/ProductCardWrapper'
import { getProductById } from '../../services/ProductService'
import { removeFromWishlist } from '../../services/CustomerService'

export default function WishlistItem(props) {
	const { productId, sku, title, id, onRemoveFromWishlist } = props

	const [product, setProduct] = useState(null)

	useEffect(() => {
		const init = async () => {
			const product = await getProductById(productId)
			setProduct(product)
		}
		init()
	}, [productId])

	const _onRemoveFromWishList = async () => {
		onRemoveFromWishlist()
	}

	return (
		<>
			{product && (
				<ProductCardWrapper
					vtexProduct={product}
					onRemoveFromWishList={_onRemoveFromWishList}
				/>
			)}
		</>
	)
}
