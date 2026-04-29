import Eitri from 'eitri-bifrost'
import { HeaderCart, HeaderContentWrapper, HeaderLogo, HeaderSearchIcon } from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { goToCartman } from '../../utils/utils'

export default function MainHeader() {
	const { cart } = useLocalShoppingCart()

	// Alterei o nome só pra seguir o padrão de outros locais
	const goToSearch = () => {
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
				<HeaderSearchIcon onClick={goToSearch} />

				<HeaderCart cart={cart} />
			</View>
		</HeaderContentWrapper>
	)
}
