import {
	HeaderCart,
	HeaderContentWrapper,
	HeaderLogo,
	HeaderReturn,
	HeaderSearchIcon
} from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import Eitri from 'eitri-bifrost'

export default function Header() {
	const { cart } = useLocalShoppingCart()

	const navigateToSearch = () => {
		console.log('aqui')
		Eitri.navigation.navigate({
			path: 'Search'
		})
	}

	return (
		<HeaderContentWrapper className='justify-between'>
			<HeaderReturn />
			<View className='flex justify-between gap-[12px]'>
				<HeaderCart cart={cart} />
			</View>
		</HeaderContentWrapper>
	)
}
