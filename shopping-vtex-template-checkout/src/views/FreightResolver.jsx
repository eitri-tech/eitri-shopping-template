import { useLocalShoppingCart } from '../providers/LocalCart'
import { navigate, openCart } from '../services/navigationService'
import { cartShippingResolver } from 'shopping-vtex-template-shared'

export default function FreightResolver(props) {
	const { cart } = useLocalShoppingCart()

	useEffect(() => {
		if (!cart?.shippingData?.address) {
			navigate('AddressForm', {}, true)
		} else {
			if (!cart?.shippingData?.address?.number) {
				navigate('AddressForm', { addressId: cart?.shippingData?.address?.addressId }, true)
				return
			}

			const shippingData = cartShippingResolver(cart)
			if (!shippingData || shippingData?.options?.length === 0) {
				openCart()
				return
			}

			navigate('ShippingMethod', {}, true)
		}
	}, [cart])

	return <Page></Page>
}
