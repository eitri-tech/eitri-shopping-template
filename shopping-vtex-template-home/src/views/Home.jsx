import Eitri from 'eitri-bifrost'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { getCmsContent } from '../services/CmsService'
import { startConfigure } from '../services/AppService'
import HomeSkeleton from '../components/HomeSkeleton/HomeSkeleton'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
import MainHeader from '../components/Header/MainHeader'
import { BottomInset } from 'shopping-vtex-template-shared'

export default function Home() {
	const { startCart } = useLocalShoppingCart()
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
			topInset>
			<MainHeader />
			<View>
				<HomeSkeleton show={!cmsContent} />
				<CmsContentRender cmsContent={cmsContent} />
				<BottomInset />
			</View>
		</Page>
	)
}
