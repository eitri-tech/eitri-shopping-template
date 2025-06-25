import Eitri from 'eitri-bifrost'
import { Text, View } from 'eitri-luminus'
import SwiperContent from '../../SwiperContent/SwiperContent'
export default function CategoryShelf(props) {
	const { data } = props
	const goToCategoryPage = category => {
		Eitri.navigation.navigate({
			path: 'ProductCatalog',
			state: {
				facets: category.facets,
				title: category.title
			}
		})
	}
	if (data?.mode === 'fitOnScreen') {
		return (
			<View>
				{data?.title && (
					<View className='px-8'>
						<Text className="font-bold font-['Baloo_2']">{data.title}</Text>
					</View>
				)}
				<View
					title={data.title}
					className='flex justify-between px-8 overflow-scroll'>
					{data?.shelves?.map(category => (
						<View
							key={category.imageUrl}
							onClick={() => goToCategoryPage(category)}>
							<View
								backgroundImage={category.imageUrl}
								className='w-[100px] h-[50px]'
							/>
						</View>
					))}
				</View>
			</View>
		)
	}
	if (data?.mode === 'scroll') {
		return (
			<SwiperContent
				title={data.title}
				className='px-8'>
				{data?.shelves?.map(category => (
					<View
						key={category.imageUrl}
						onClick={() => goToCategoryPage(category)}>
						<View
							backgroundImage={category.imageUrl}
							className='w-[100px] h-[50px]'
						/>
					</View>
				))}
			</SwiperContent>
		)
	}
}
