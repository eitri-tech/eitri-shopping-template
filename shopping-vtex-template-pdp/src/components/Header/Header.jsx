import { HeaderCart, HeaderContentWrapper, HeaderReturn } from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import Eitri from 'eitri-bifrost'

export default function Header() {
	const { cart } = useLocalShoppingCart()

	const navigateToSearch = () => {
		Eitri.navigation.navigate({
			path: 'Search'
		})
	}

	return (
		<HeaderContentWrapper className='justify-between'>
			<HeaderReturn />
			<HeaderCart cart={cart} />
		</HeaderContentWrapper>
	)
}
