import Description from './Description'
import Information from './Information'
import Supplier from './Supplier'
export default function DescriptionComponent(props) {
	const { product } = props

	return (
		<View className='flex flex-col gap-4 bg-white rounded shadow-sm border border-gray-300 p-4 w-full'>
			<Description description={product?.description} />
			<Information product={product} />
		</View>
	)
}
