import Eitri from 'eitri-bifrost'
import { Loading, HeaderContentWrapper, HeaderText, HeaderSearchIcon } from 'eitri-shopping-montreal-shared'
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
			path: '/Search'
		})
	}

	return (
		<Page
			title='Categorias'
			bottomInset
			topInset>
			<HeaderContentWrapper className='justify-between'>
				<HeaderText text={t('categories.title')} />
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
