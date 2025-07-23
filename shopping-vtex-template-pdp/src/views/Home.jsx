import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { Loading } from 'shopping-vtex-template-shared'
import { openCart } from '../services/NavigationService'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { crash, crashLog, sendViewItem } from '../services/trackingService'
import { getProductById, getProductBySlug, markLastViewedProduct } from '../services/productService'
import { addToWishlist, productOnWishlist, removeItemFromWishlist } from '../services/customerService'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel'
import MainDescription from '../components/MainDescription/MainDescription'
import SkuSelector from '../components/SkuSelector/SkuSelector'
import Freight from '../components/Freight/Freight'
import RichContent from '../components/RichContent/RichContent'
import DescriptionComponent from '../components/Description/DescriptionComponent'
import Reviews from '../components/Reviews/Reviews'
import RelatedProducts from '../components/RelatedProducts/RelatedProducts'
import { setLanguage, startConfigure } from '../services/AppService'
import { useTranslation } from 'eitri-i18n'
import Header from '../components/Header/Header'
import { saveCartIdOnStorage } from '../services/cartService'
import ActionButton from '../components/ActionButton/ActionButton'

export default function Home() {
	const { startCart, cart } = useLocalShoppingCart()
	const [product, setProduct] = useState(null)
	const [isLoading, setIsLoading] = useState(null)
	const [configLoaded, setConfigLoaded] = useState(false)
	const [loadingWishlist, setLoadingWishlist] = useState(true)
	const [itemWishlistId, setItemWishlistId] = useState(-1)
	const [currentSku, setCurrentSku] = useState(null)

	useEffect(() => {
		window.scroll(0, 0)

		startHome()

		Eitri.navigation.setOnResumeListener(() => {
			startHome()
		})
	}, [])

	const startHome = async () => {
		setIsLoading(true)

		const startParams = await Eitri.getInitializationInfos()

		let product = await startParams.product
		if (product) {
			setProduct(product)
			setCurrentSku(product.items[0])
			setIsLoading(false)
		}

		await loadConfigs()

		if (!product) {
			product = await loadProduct(startParams)
		}

		if (product) {
			setProduct(product)
			setCurrentSku(product.items[0])
			setIsLoading(false)
		}

		await loadCart(startParams)

		sendViewItem(product)
		markLastViewedProduct(product)
	}

	const handleSaveFavorite = async () => {
		setLoadingWishlist(true)
		if (itemWishlistId === -1) {
			try {
				const result = await addToWishlist(product?.productId, product?.productName, product?.items[0]?.itemId)
				setItemWishlistId(result?.data?.addToList)
			} catch (e) {
				console.error('handleSaveFavorite: Error', e)
			}
		} else {
			await removeItemFromWishlist(itemWishlistId)
			setItemWishlistId(-1)
		}
		setLoadingWishlist(false)
	}

	const handleShare = async linkText => {
		const { host } = Vtex.configs
		await Eitri.share.link({
			url: `${host}/${linkText}/p`
		})
	}

	const navigateCart = () => {
		openCart(cart)
	}

	const loadProduct = async startParams => {
		try {
			if (startParams.productId) {
				return await getProductById(startParams.productId)
			}
			if (startParams.slug) {
				return await getProductBySlug(startParams.productId)
			}
		} catch (e) {
			console.error('loadProduct: Error', e)
			return null
		}
	}

	const loadCart = async startParams => {
		if (startParams?.orderFormId) {
			await saveCartIdOnStorage(startParams?.orderFormId)
		}
		await startCart()
	}

	const loadConfigs = async () => {
		try {
			await startConfigure()
			setConfigLoaded(true)
		} catch (e) {
			crashLog('Erro ao buscar configurações', e)
			crash()
		}
	}

	const isProductInCart = productId => {
		return cart?.items?.some(productInCart => {
			return productInCart.productId === productId
		})
	}

	const checkIfIsFavorite = async productId => {
		setLoadingWishlist(true)
		const { inList, listId } = await productOnWishlist(productId)
		if (inList) {
			setItemWishlistId(listId)
		}
		setLoadingWishlist(false)
	}

	const onSkuChange = newDesiredVariations => {
		const productSku = product.items.find(item => {
			return newDesiredVariations.every(
				newDesiredVariation => item[newDesiredVariation.variation][0] === newDesiredVariation.value
			)
		})
		if (productSku) {
			setCurrentSku(productSku)
		}
	}

	return (
		<Page title='Página de produto'>
			<Header />

			<Loading
				isLoading={isLoading}
				fullScreen
			/>
			{product && (
				<View bottomInset={'auto'}>
					<ImageCarousel currentSku={currentSku} />

					<View className='px-4 flex flex-col gap-4'>
						<MainDescription
							product={product}
							currentSku={currentSku}
						/>

						<SkuSelector
							currentSku={currentSku}
							product={product}
							onSkuChange={onSkuChange}
							className='mt-8'
						/>

						<Freight currentSku={currentSku} />

						<RichContent product={product} />

						<DescriptionComponent product={product} />

						<Reviews />
					</View>
					<View className='mb-8'>{configLoaded && <RelatedProducts product={product} />}</View>
					<ActionButton currentSku={currentSku} />
				</View>
			)}
		</Page>
	)
}
