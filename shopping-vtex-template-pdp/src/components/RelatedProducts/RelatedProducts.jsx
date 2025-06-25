import ProductCarousel from '../ProductCarousel/ProductCarousel'
import { useTranslation } from 'eitri-i18n'
import { getWhoSawAlsoSaw } from '../../services/productService'
import ShelfOfProducts from '../ShelfOfProducts/ShelfOfProducts'
export default function RelatedProducts(props) {
	const { product } = props
	const { t } = useTranslation()
	const [relatedProducts, setRelatedProducts] = useState(null)
	useEffect(() => {
		if (!product) return
		loadRelatedProducts(product?.productId)
	}, [product])
	const loadRelatedProducts = async productId => {
		try {
			let relatedProducts = await getWhoSawAlsoSaw(productId)
			setRelatedProducts(relatedProducts)
			return relatedProducts
		} catch (e) {
			console.log('loadRelatedProducts: Error', e)
		}
	}
	if (!relatedProducts) return null
	return (
		<ShelfOfProducts
			title={t('productBasicTemplate.txtWhoSaw')}
			mode='carousel'
			products={relatedProducts}
		/>
	)
}
