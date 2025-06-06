import { HeaderReturn } from 'shopping-vtex-template-shared'
import { Text, View} from "eitri-luminus";
export default function CategoryPageItem(props) {
  const { item, goToItem } = props
  const [headerHeight, setHeaderHeight] = useState(0)
  useEffect(() => {
    loadHeaderHeight()
  }, [])
  const loadHeaderHeight = () => {
    const element = document.getElementById('mini-header')
    const headerHeight = element.offsetHeight
    setHeaderHeight(headerHeight)
  }
  const [showSubItems, setShowSubItems] = useState(false)
  return (
    <>
      <View onClick={() => setShowSubItems(true)} className="p-8 flex justify-between items-center">
        <Text className="font-bold">{item.title}</Text>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 6L15 12L9 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
      </View>
      <View
        className={`
          w-screen 
          ${showSubItems ? 'absolute left-0' : 'fixed left-[100vw]'} 
          top-0 
          transition-left duration-200 
          z-[9999]
        `}
      >
        <View>
        <View
          className={`
            fixed top-0 right-0 bg-base-100 
            ${showSubItems ? 'left-0' : 'left-[100vw]'} 
            transition-left duration-200
          `}
        >
            <View topInset className="bg-primary-content" />
              <View
                id="mini-header"
                className="w-screen px-8 flex items-center justify-between bg-primary-content"
              >

              <View className="flex items-center">
                <HeaderReturn onClick={() => setShowSubItems(false)} />
                <Text contentColor className="text-primary-content">
                  {item.title}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="min-h-screen bg-base-100">
          <View topInset />
          <View className={`w-full h-[${headerHeight}px]`} />
          <View className="flex flex-col p-8">
            {item?.subcategories?.map((subItem, index) => (
              <View onClick={() => goToItem(subItem)} className="p-8 flex justify-between items-center">
                <Text className="font-bold">{subItem.title}</Text>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 6L15 12L9 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
              </View>
            ))}
          </View>
          <View bottomInset />
        </View>
      </View>
    </>
  )
}
