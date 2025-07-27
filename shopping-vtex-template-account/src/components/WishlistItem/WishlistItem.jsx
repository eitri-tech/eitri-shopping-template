import { getProductById } from '../../services/ProductService'
import ProductCard from '../ProductCard/ProductCard'

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

	return <>{product && <ProductCard product={product} />}</>
}
