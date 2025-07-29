import WishlistIcon from '../ProductCard/components/WishlistIcon'

export default function HeaderWishList(props) {
	const { filled, className, onClick } = props

	return (
		<View onClick={onClick}>
			<WishlistIcon
				checked={filled}
				className={className}
			/>
		</View>
	)
}
