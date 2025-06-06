import WishlistIcon from './components/WishlistIcon'
import Loading from '../Loading/LoadingComponent'
import { Text, View, Image} from "eitri-luminus";

export default function ProductCardFullImage(props) {
	const {
		listPrice,
		image,
		name,
		price,
		width = 148,
		installments,
		loadingCartOp,
		loadingWishlistOp,
		isOnWishlist,
		showListItem,
		actionLabel,
		onPressOnCard,
		onPressCartButton,
		onPressOnWishlist
	} = props

	return (
		<View
			onClick={onPressOnCard}
			className={`
				relative bg-accent-100 
				${width ? `min-w-[${width}px] max-w-[${width}px]` : 'min-w-auto max-w-auto'} 
			`}
			>
			<View className={`flex flex-col w-full shadow-md rounded-lg`}>
				<View className={`relative flex flex-col w-full justify-center items-center rounded-lg  h-[240px] w-full min-h-[240px] max-h-[240px]`}>
					<View className={`w-full h-[240px] rounded-lg flex items-center justify-center`}>
						<Image className={`object-contain h-[240px] rounded-lg`} src={image} />
					</View>

					<View className="absolute top-[8px] right-[5px] flex items-center justify-center rounded-full bg-accent-100 z-[99] ">
						<View className="w-[30px] h-[30px] flex justify-center items-center">
						<WishlistIcon checked={isOnWishlist} />
						</View>
					</View>
				</View>

					<View className={`w-full p-2`}>
						<View className="mt-2 w-full flex justify-between gap-4">
							<Text className="line-clamp-2 font-medium text-xs break-words">
							{name}
						</Text>
					</View>

					<View className="flex flex-col gap-2 mt-1" >
						{showListItem && (
							<>
								{listPrice ? (
									<Text className="line-through font-bold text-neutral-500 text-xs">
										{listPrice}
									</Text>
								) : (
									<View className="h-[16px]" />
								)}
							</>
						)}

						<Text className="font-bold text-primary-700 text-sm">
						{price}
						</Text>

						{installments ? (
							<Text className="font-bold text-neutral-500 text-xs">
								{installments}
							</Text>
						) : (
							<View className="h-[16px]" />
						)}
					</View>
				</View>

				<View
					onClick={(e) => {
						e.stopPropagation();
						onPressCartButton();
					}}
					className={`
						h-[36px] flex justify-center items-center 
						border border-primary-700 border-[0.5px] 
						rounded-lg
						${loadingCartOp ? 'bg-neutral-100' : 'bg-primary-700'}
						mx-2 mb-2
					`}
				>
					{loadingCartOp ? (
						<Loading width='36px' />
					) : (
						<Text className="text-background font-medium text-xs">
							{actionLabel}
						</Text>
					)}
				</View>
			</View>

			<View className="absolute top-0 bottom-0 left-0 right-0" />
		</View>
	)
}
