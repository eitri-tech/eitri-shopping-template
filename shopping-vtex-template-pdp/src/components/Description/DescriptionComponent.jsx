import Description from './Description'
import Information from './Information'
import { GenericBox } from 'shopping-vtex-template-shared'

export default function DescriptionComponent(props) {
	const { product } = props

	return (
		<>
			<Description description={product?.description} />
			<Information product={product} />
		</>
	)
}
