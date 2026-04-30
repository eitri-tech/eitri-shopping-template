import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import { View } from 'eitri-luminus'
import { Loading, BottomInset } from 'shopping-vtex-template-shared'
import ActionButton from '../components/ActionButton/ActionButton'
import DescriptionComponent from '../components/Description/DescriptionComponent'
import Freight from '../components/Freight/Freight'
import Header from '../components/Header/Header'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel'
import MainDescription from '../components/MainDescription/MainDescription'
import RelatedProducts from '../components/RelatedProducts/RelatedProducts'
import Reviews from '../components/Reviews/Reviews'
import SkuSelector from '../components/SkuSelector/SkuSelector'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { startConfigure } from '../services/AppService'
import { saveCartIdOnStorage } from '../services/cartService'
import { getProductById, getProductBySlug, markLastViewedProduct } from '../services/productService'
import { crashLog, sendScreenView, sendViewItem } from '../services/trackingService'

export default function Home() {
	const { startCart } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [product, setProduct] = useState(null)
	const [isLoading, setIsLoading] = useState(null)
	const [configLoaded, setConfigLoaded] = useState(false)
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
			setCurrentSku(findAvailableSKU(product))
			setIsLoading(false)
		}

		await loadConfigs()

		if (!product) {
			product = await loadProduct(startParams)
		}

		if (product) {
			setProduct(product)
			setCurrentSku(findAvailableSKU(product))
			setIsLoading(false)
		}

		await loadCart(startParams)

		sendScreenView('PDP', 'home')
		sendViewItem(product)
		markLastViewedProduct(product)
	}

	const findAvailableSKU = product => {
		const availableSku = product.items.find(item =>
			item.sellers.some(seller => seller.commertialOffer?.AvailableQuantity > 0)
		)

		return availableSku || product.items[0]
	}

	const loadProduct = async startParams => {
		try {
			if (startParams.productId) {
				return await getProductById(startParams.productId)
			}

			if (startParams.slug) {
				return await getProductBySlug(startParams.slug)
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
			crashLog()
		}
	}

	const onSkuChange = newDesiredVariations => {
		const productSku = product.items.find(item => {
			return item.itemId === newDesiredVariations?.itemId
		})

		if (productSku) {
			setCurrentSku(productSku)
		}
	}

	return (
		<Page title={t('home.pageTitle', 'Página de produto')}>
			<Header
				product={product}
				configLoaded={configLoaded}
			/>

			<Loading
				isLoading={isLoading}
				fullScreen
			/>

			{product && (
				<View>
					<View className='pb-4'>
						<ImageCarousel currentSku={currentSku} />

						<View className='mt-4 px-4 flex flex-col gap-4'>
							<MainDescription
								product={product}
								currentSku={currentSku}
							/>

							<SkuSelector
								currentSku={currentSku}
								product={product}
								onSkuChange={onSkuChange}
							/>

							{configLoaded && <Freight currentSku={currentSku} />}

							{/*<RichContent product={product} />*/}

							<DescriptionComponent product={product} />

							<Reviews />
						</View>

						{configLoaded && <RelatedProducts product={product} />}
					</View>

					<ActionButton currentSku={currentSku} />

					<BottomInset />
				</View>
			)}
		</Page>
	)
}
