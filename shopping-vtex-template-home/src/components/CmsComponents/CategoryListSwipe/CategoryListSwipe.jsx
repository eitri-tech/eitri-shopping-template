import { View } from 'eitri-luminus'
import { processActions } from '../../../services/ResolveCmsActions'
import CategoryPageItem from './components/CategoryPageItem'

export default function CategoryListSwipe(props) {
	const { data } = props

	const openItem = item => processActions(item)

	return (
		<View className='flex flex-col p-4 gap-4 w-screen max-w-screen overflow-x-hidden'>
			{data?.content &&
				data?.content?.map((item, index) => (
					// Antes tava dando erro de chaves duplicadas
					<CategoryPageItem
						key={`${item.title}-${index}`}
						item={item}
						goToItem={openItem}
					/>
				))}
			<View
				bottomInset={'auto'}
				className='w-full'
			/>
		</View>
	)
}
