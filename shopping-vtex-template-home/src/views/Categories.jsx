import Eitri from 'eitri-bifrost'
import { HEADER_TYPE, HeaderTemplate, Loading } from 'shopping-vtex-template-shared'
import { getCmsContent } from '../services/CmsService'
import { useTranslation } from 'eitri-i18n'
import CmsContentRender from '../components/CmsContentRender/CmsContentRender'
export default function Categories() {
  const { t } = useTranslation()
  const [cmsContent, setCmsContent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    loadCms()
  }, [])
  const loadCms = async () => {
    const { sections } = await getCmsContent('categories', 'categorias')
    setCmsContent(sections)
    setIsLoading(false)
  }
  const goToSearch = () => {
    Eitri.navigation.navigate({
      path: '/Search',
    })
  }
  return (
    <Page bottomInset topInset>
      <HeaderTemplate
        headerType={HEADER_TYPE.TEXT_AND_SEARCH_ICON}
        contentText={t('categories.title')}
        navigateToSearch={goToSearch}
      />
      <Loading fullScreen isLoading={isLoading} />
      <CmsContentRender cmsContent={cmsContent} />
    </Page>
  )
}
