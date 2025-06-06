import { getMappedComponent } from '../../utils/getMappedComponent'
import Eitri from 'eitri-bifrost'
import {View} from "eitri-luminus";

export default function CmsContentRender(props) {
  const { cmsContent } = props
  const [key, setKey] = useState(new Date().getTime())
  useEffect(() => {
    if (cmsContent) {
      Eitri.navigation.setOnResumeListener(() => {
        const currentTime = new Date().getTime()
        setKey(currentTime)
      })
    }
  }, [cmsContent])
  return (
    <View className="pb-8 pt-2 gap-6 flex flex-col pt-[100px]">{cmsContent?.map((content) => getMappedComponent(content, key))}</View>
  )
}
