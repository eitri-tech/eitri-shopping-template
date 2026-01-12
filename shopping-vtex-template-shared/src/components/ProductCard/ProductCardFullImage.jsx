import WishlistIcon from './components/WishlistIcon'
import Loading from '../Loading/LoadingComponent'
import { Text, View, Image } from 'eitri-luminus'

export default function ProductCardFullImage(props) {
	const {
		listPrice,
		image,
		name,
		price,
		installments,
		loadingCartOp,
		isOnWishlist,
		showListItem,
		actionLabel,
		onPressOnCard,
		onPressCartButton,
		onPressOnWishlist,
		className
	} = props

	const _onPressOnWishlist = e => {
		e.stopPropagation()
		onPressOnWishlist()
	}

	return (
		<View
			onClick={onPressOnCard}
			className={`relative bg-white rounded ${className}`}>
			<View className={`flex flex-col w-full shadow-md rounded`}>
				<View
					className={`relative flex flex-col w-full justify-center items-center rounded-t h-[240px] min-h-[240px] max-h-[240px]`}>
					<Image
						className={`object-contain h-full w-full rounded`}
						src={image}
					/>

					<View
						onClick={_onPressOnWishlist}
						className='absolute top-[7px] p-2 right-[6px] flex items-center justify-center rounded-full backdrop-blur-sm bg-header-background z-[99] '>
						<WishlistIcon
							filled={isOnWishlist}
							size={'20'}
						/>
					</View>
				</View>

				<View className={`w-full p-2`}>
					<View className='mt-2 w-full flex justify-between gap-4 h-[40px]'>
						<Text className='line-clamp-2 font-medium text-sm break-words'>{name}</Text>
					</View>

					<View className='flex flex-col gap-2 mt-1'>
						{showListItem && (
							<>
								{listPrice ? (
									<Text className='line-through font-bold text-neutral-500 text-xs'>{listPrice}</Text>
								) : (
									<View className='h-[16px]' />
								)}
							</>
						)}

						<Text className='font-bold text-primary-700 text'>{price}</Text>

						{installments ? (
							<Text className='font-bold text-neutral-500 text-xs'>{installments}</Text>
						) : (
							<View className='h-[16px]' />
						)}
					</View>
				</View>

				<View
					onClick={e => {
						e.stopPropagation()
						onPressCartButton()
					}}
					className={`mt-2 h-[36px] bg-primary w-full rounded-b flex justify-center items-center border-primary-700 border-[0.5px] bg-primary-700 z-[99]`}>
					{loadingCartOp ? (
						<Loading width='36px' />
					) : (
						<Text className='text-primary-content font-medium text-xs'>{actionLabel}</Text>
					)}
				</View>
			</View>
		</View>
	)
}
