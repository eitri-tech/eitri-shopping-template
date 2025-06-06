import WishlistIcon from './components/WishlistIcon'
import Loading from '../Loading/LoadingComponent'

export default function ProductCardDefault(props) {
	const {
		listPrice,
		image,
		name,
		price,
		width,
		installments,
		loadingCartOp,
		loadingWishlistOp,
		isOnWishlist,
		showListItem,
		actionLabel,
		badge,
		onPressOnCard,
		onPressCartButton,
		onPressOnWishlist
	} = props
	return (
		<View className="relative bg-accent-500 min-w-auto max-w-auto rounded-lg mb-4 ">
			<View className="flex flex-col shadow-lg rounded-lg p-2"> 
				{badge ? (
					<View className="max-h-[27px] min-h-[27px] rounded-full w-fit bg-green-300 px-4 py-1">
						<Text className="font-bold font-baloo">{badge}</Text>
					</View>
				) : (
					<View className="h-[27px]" />
				)}

				<View className="relative flex flex-col w-full justify-center items-center h-[143px] min-h-[143px] max-h-[143px]">
					<Image className="max-w-full max-h-full rounded-lg" src={image} />
				</View>

				<View className="mt-2 flex justify-between gap-4 h-[48px]">
					<Text className="line-clamp-3 font-medium text-xs">{name}</Text>
					<View className="h-[36px] w-[36px] z-[98]">
						<WishlistIcon checked={isOnWishlist} />
					</View>
				</View>

				<View className="flex flex-col gap-2 mt-1">
					{listPrice ? (
						<Text className="line-through font-bold text-neutral-500 text-xs">{listPrice}</Text>
					) : (
						<View className="h-[16px]" />
					)}

					<Text className="font-bold text-primary-700 text-sm">{price}</Text>

					{installments ? (
						<Text className="font-bold text-neutral-500 text-xs">{installments}</Text>
					) : (
						<View className="h-[16px]" />
					)}
				</View>

				<View onClick={onPressOnCard} className="mt-1 h-[36px] w-full rounded-full flex justify-center items-center border border-primary-700 border-[0.5px] bg-primary-700 z-[99]">
					{loadingCartOp ? (
						<Loading width="36px" />
					) : (
						<Text className="text-background-color font-medium text-xs">{actionLabel}</Text>
					)}
				</View>
			</View>

			<View className="absolute top-0 bottom-0 left-0 right-0" />
		</View>
	)
}
