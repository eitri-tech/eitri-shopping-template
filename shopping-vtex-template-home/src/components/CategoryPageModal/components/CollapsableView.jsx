import { Text, View} from "eitri-luminus";
export default function CollapsableView(props) {
  const { children, title, willStartCollapsed } = props
  const [collapsed, setCollapsed] = useState(willStartCollapsed)
  useEffect(() => {
    setCollapsed(!!willStartCollapsed)
  }, [])
  const toggleCollapsedState = () => {
    setCollapsed(!collapsed)
  }
  return (
    <View borderTopWidth={'hairline'} className="border-neutral-content p-2">
      <View onClick={toggleCollapsedState} className="flex flex flex-row justify-between items-center">
        <Text className="text-lg">{title}</Text>
        
        {/* <Icon iconKey={collapsed ? 'chevron-down' : 'chevron-up'} width={24} /> */}
      </View>
      {!collapsed && <View className="my-2">{children}</View>}
    </View>
  )
}
