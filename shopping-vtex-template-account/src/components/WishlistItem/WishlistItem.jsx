import { getProductById } from '../../services/ProductService'
import ProductCard from '../ProductCard/ProductCard'
import { useTranslation } from 'eitri-i18n'

export default function WishlistItem(props) {
	const { productId } = props
	const { t } = useTranslation()

	const [product, setProduct] = useState(null)

	useEffect(() => {
		init(productId)
	}, [productId])

	const init = async () => {
		try {
			const product = await getProductById(productId)
			console.log('productId', productId)
			setProduct(product)
		} catch (e) {
			console.error(t('wishlistItem.fetchProductError', 'Erro ao buscar produto'), e)
		}
	}

	return <>{product && <ProductCard product={product} />}</>
}
