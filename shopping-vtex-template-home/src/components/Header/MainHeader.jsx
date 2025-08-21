import { HeaderCart, HeaderContentWrapper, HeaderLogo, HeaderSearchIcon } from 'eitri-shopping-montreal-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import Eitri from 'eitri-bifrost'
import { goToCartman } from '../../utils/utils'

export default function MainHeader() {
	const { cart } = useLocalShoppingCart()

	const navigateToSearch = () => {
		Eitri.navigation.navigate({
			path: 'Search'
		})
	}

	return (
		<HeaderContentWrapper
			scrollEffect={true}
			className='justify-between'>
			<View onClick={goToCartman}>
				<HeaderLogo />
			</View>

			<View className='flex justify-between gap-[12px]'>
				<HeaderSearchIcon onClick={navigateToSearch} />
				<HeaderCart cart={cart} />
			</View>
		</HeaderContentWrapper>
	)
}
