import Eitri from 'eitri-bifrost'
import {
	Loading,
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	HeaderSearchIcon
} from 'shopping-vtex-template-shared'
import { getCmsContent } from '../services/CmsService'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'

export default function LandingPage(props) {
	const [cmsContent, setCmsContent] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const pageTitle = props?.location?.state?.title ?? ''
	const openInBottomBar = !!props?.location?.state?.openInBottomBar

	useEffect(() => {
		loadCms()
	}, [])

	const loadCms = async () => {
		try {
			const landingPageName = props?.location?.state?.landingPageName
			const { sections } = await getCmsContent('landingPage', landingPageName)
			setCmsContent(sections)
			setIsLoading(false)
		} catch (e) {
			setIsLoading(false)
		}
	}

	const goToSearch = () => {
		Eitri.navigation.navigate({ path: 'Search' })
	}

	return (
		<Page
			bottomInset
			topInset>
			<HeaderContentWrapper className={`justify-between`}>
				<View className={`flex items-center gap-4`}>
					{!openInBottomBar && <HeaderReturn />}

					<HeaderText text={pageTitle} />
				</View>

				<HeaderSearchIcon onClick={goToSearch} />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>
			<CmsContentRender cmsContent={cmsContent} />
		</Page>
	)
}
