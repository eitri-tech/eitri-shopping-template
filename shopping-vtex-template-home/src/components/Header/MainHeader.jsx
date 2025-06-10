import { HeaderCart, HeaderContentWrapper, HeaderLogo, HeaderSearchIcon } from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import Eitri from 'eitri-bifrost'

export default function MainHeader() {
	const { cart } = useLocalShoppingCart()

	const navigateToSearch = () => {
		console.log('aqui')
		Eitri.navigation.navigate({
			path: 'Search'
		})
	}

	return (
		<HeaderContentWrapper
			scrollEffect={true}
			className='justify-between'>
			<HeaderLogo />

			<View className='flex justify-between gap-[12px]'>
				<HeaderSearchIcon onPress={navigateToSearch} />
				<HeaderCart cart={cart} />
			</View>
		</HeaderContentWrapper>
	)
}
