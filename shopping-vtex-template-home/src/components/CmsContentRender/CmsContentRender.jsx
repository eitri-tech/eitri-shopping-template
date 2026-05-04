import Eitri from 'eitri-bifrost'
import { View } from 'eitri-luminus'
import { getMappedComponent } from '../../utils/getMappedComponent'

export default function CmsContentRender(props) {
	const { cmsContent } = props

	const [key, setKey] = useState(new Date().getTime())

	useEffect(() => {
		if (cmsContent) {
			Eitri.navigation.addOnResumeListener(() => {
				const currentTime = new Date().getTime()

				setKey(currentTime)
			})
		}
	}, [cmsContent])

	return <View className='flex flex-col pb-4'>{cmsContent?.map(content => getMappedComponent(content, key))}</View>
}
