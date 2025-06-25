import { View } from 'eitri-luminus'
import { resolveNavigation } from '../../../services/NavigationService'
import CategoryPageItem from './components/CategoryPageItem'
export default function CategoryListSwipe(props) {
	const { data } = props
	const openItem = item => {
		resolveNavigation(item.path, item.title)
	}
	return (
		<View className='px-8 flex flex-col'>
			{data?.content &&
				data?.content?.map(item => (
					<CategoryPageItem
						item={item}
						goToItem={openItem}
					/>
				))}
		</View>
	)
}
