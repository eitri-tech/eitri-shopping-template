import { HeaderReturn, HeaderContentWrapper, HeaderText } from 'shopping-vtex-template-shared'
import Eitri from 'eitri-bifrost'
import CategoryTitle from './CategoryTitle'

export default function CategoryPageItem(props) {
	const { item, goToItem } = props

	const [showSubItems, setShowSubItems] = useState(false)

	useEffect(() => {
		if (showSubItems) {
			Eitri.navigation.addBackHandler(() => {
				setShowSubItems(false)
				return false
			})
		} else {
			Eitri.navigation.clearBackHandlers()
		}
	}, [showSubItems])

	const handleItemPress = item => {
		if (item.subcategories && item.subcategories.length > 0) {
			setShowSubItems(true)
		} else {
			goToItem(item)
		}
	}

	return (
		<>
			<CategoryTitle
				icon={item.icon}
				title={item.title}
				hasSubItems={item.subcategories && item.subcategories.length > 0}
				onClick={() => handleItemPress(item)}
			/>
			<View
				className={`flex flex-col min-h-screen h-screen w-screen fixed ${showSubItems ? 'left-0 ' : 'left-[100vw]'} top-0 transition-left duration-300 z-[9999]`}>
				<HeaderContentWrapper
					containerClassName={`${showSubItems ? 'left-0' : '!left-[100vw] !shadow-none'} transition-left !duration-300 !backdrop-blur-none !bg-white`}>
					<HeaderReturn onClick={() => setShowSubItems(false)} />
					<HeaderText text={item.title}>{item.title}</HeaderText>
				</HeaderContentWrapper>
				<View
					bottomInset={'auto'}
					className='bg-base-100 flex-1'>
					<View className='flex flex-col p-4 gap-4'>
						{item?.action && (
							<CategoryTitle
								icon={item.icon}
								hasSubItems={false}
								title={`Ver tudo em ${item.title}`}
								onClick={() => goToItem(item)}
							/>
						)}
						{item?.subcategories?.map((subItem, index) => (
							<CategoryTitle
								key={subItem.title}
								icon={subItem.icon}
								hasSubItems={false}
								title={subItem.title}
								onClick={() => handleItemPress(subItem)}
							/>
						))}
					</View>
				</View>
			</View>
		</>
	)
}
