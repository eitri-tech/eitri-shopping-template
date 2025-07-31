import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'
import { Loading } from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { crashLog, sendScreenView, sendViewItem } from '../services/trackingService'
import ImageCarousel from '../components/ImageCarousel/ImageCarousel'
import MainDescription from '../components/MainDescription/MainDescription'
import SkuSelector from '../components/SkuSelector/SkuSelector'
import Freight from '../components/Freight/Freight'
import RichContent from '../components/RichContent/RichContent'
import DescriptionComponent from '../components/Description/DescriptionComponent'
import Reviews from '../components/Reviews/Reviews'
import RelatedProducts from '../components/RelatedProducts/RelatedProducts'
import { startConfigure } from '../services/AppService'
import Header from '../components/Header/Header'
import { saveCartIdOnStorage } from '../services/cartService'
import ActionButton from '../components/ActionButton/ActionButton'

export default function Home() {
	const { startCart } = useLocalShoppingCart()

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

		sendScreenView('PDP', 'home')
		sendViewItem(product)
		markLastViewedProduct(product)
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
			crashLog()
		}
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
			<Header
				product={product}
				configLoaded={configLoaded}
			/>

			<Loading
				isLoading={isLoading}
				fullScreen
			/>

			{product && (
				<View bottomInset={'auto'}>
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

							<Freight currentSku={currentSku} />

							{/*<RichContent product={product} />*/}

							<DescriptionComponent product={product} />

							<Reviews />
						</View>

						{configLoaded && <RelatedProducts product={product} />}
					</View>

					<ActionButton currentSku={currentSku} />
				</View>
			)}
		</Page>
	)
}
