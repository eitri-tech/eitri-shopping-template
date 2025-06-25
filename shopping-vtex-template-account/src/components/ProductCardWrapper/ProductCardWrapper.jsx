import ProductCardVertical from '../ProductCard/ProductCardVertical'
import { openProduct } from '../../services/NavigationService'
import { removeFromWishlist } from '../../services/CustomerService'

export default function ProductCardWrapper(props) {
	const { vtexProduct, width, onRemoveFromWishList } = props

	const item = vtexProduct?.items?.[0]

	const sellerDefault = item?.sellers?.find(seller => seller.sellerDefault) || item?.sellers?.[0]

	// TODO - internacionalizar preço
	const formatPrice = price => {
		if (!price) return ''
		return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
	}

	const formatInstallments = seller => {
		const installments = seller?.commertialOffer.Installments

		const maxInstallments = installments?.reduce((acc, curr) => {
			return curr.NumberOfInstallments > acc.NumberOfInstallments ? curr : acc
		}, installments[0])

		if (!maxInstallments) return ''

		return `em até ${maxInstallments?.NumberOfInstallments}x ${formatPrice(maxInstallments?.Value)}`
	}

	const onWishListPress = async () => {
		onRemoveFromWishList()
	}

	const goToProductDetail = () => {
		openProduct(vtexProduct)
	}

	const getBadge = () => {
		const price = sellerDefault?.commertialOffer?.Price
		const listPrice = sellerDefault?.commertialOffer?.ListPrice

		if (price !== listPrice) {
			const discount = ((listPrice - price) / listPrice) * 100
			return `${discount.toFixed(0)}% off`
		} else {
			return ''
		}
	}

	return (
		<ProductCardVertical
			name={item?.nameComplete || item?.name || ''}
			image={item?.images?.[0]?.imageUrl}
			listPrice={formatPrice(sellerDefault?.commertialOffer.ListPrice)}
			price={formatPrice(sellerDefault?.commertialOffer.Price)}
			installments={formatInstallments(sellerDefault)}
			onWishListPress={onWishListPress}
			width={width}
			onPress={goToProductDetail}
			badge={getBadge()}
		/>
	)
}
