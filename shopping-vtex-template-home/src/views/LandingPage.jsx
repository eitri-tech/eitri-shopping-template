import { Loading, HeaderTemplate, HEADER_TYPE } from 'shopping-vtex-template-shared'
import { getCmsContent } from '../services/CmsService'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
export default function LandingPage(props) {
  const [cmsContent, setCmsContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const pageTitle = props?.location?.state?.title ?? ''
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
  return (
    <Page bottomInset topInset>
      <HeaderTemplate headerType={HEADER_TYPE.RETURN_AND_TEXT} contentText={pageTitle} />
      <Loading fullScreen isLoading={isLoading} />
      <CmsContentRender cmsContent={cmsContent} />
    </Page>
  )
}
