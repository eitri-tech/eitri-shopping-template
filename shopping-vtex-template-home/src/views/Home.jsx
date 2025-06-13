import Eitri from 'eitri-bifrost'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { getCmsContent } from '../services/CmsService'
import { setLanguage, startConfigure } from '../services/AppService'
import { useTranslation } from 'eitri-i18n'
import HomeSkeleton from '../components/HomeSkeleton/HomeSkeleton'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import MainHeader from '../components/Header/MainHeader'

export default function Home() {
	const { cart, startCart } = useLocalShoppingCart()
	const { i18n } = useTranslation()
	const [cmsContent, setCmsContent] = useState(null)

	useEffect(() => {
		startHome()
		requestNotificationPermission()
		Eitri.navigation.setOnResumeListener(() => {
			startCart()
		})
	}, [])

	const requestNotificationPermission = async () => {
		try {
			let notificationPermissionStatus = await Eitri.notification.checkPermission()
			if (notificationPermissionStatus.status === 'DENIED') {
				await Eitri.notification.requestPermission()
			}
		} catch (e) {
			console.error('Erro ao solicitar permissão para notificação', e)
		}
	}

	const startHome = async () => {
		startConfigure()
			.then(resolveRedirectAndCartAndCms)
			.catch(e => {
				console.error('Erro startConfigure: ', e)
			})
	}

	const resolveRedirectAndCartAndCms = async () => {
		const startParams = await Eitri.getInitializationInfos()
		if (startParams) {
			const openRoute = processDeepLink(startParams)
			if (openRoute) {
				Eitri.navigation.navigate(openRoute)
				return
			}
		}
		setLanguage(i18n)
		loadCms()
		startCart()
	}

	const processDeepLink = startParams => {
		if (startParams?.route) {
			let { route, ...rest } = startParams
			return {
				path: route,
				state: rest,
				replace: true
			}
		}
	}

	const loadCms = async () => {
		const { sections } = await getCmsContent('home', 'home')
		setCmsContent(sections)
	}

	return (
		<Page
			title='Home'
			topInset
			bottomInset>
			<MainHeader />
			<HomeSkeleton show={!cmsContent} />
			<CmsContentRender cmsContent={cmsContent} />
		</Page>
	)
}
