import WishlistIcon from '../WishlistIcon/WishlistIcon'
import Loading from '../Loading/LoadingComponent'
import { Text, View, Image } from 'eitri-luminus'
import Eitri from 'eitri-bifrost'

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

	const [cardContainerId] = useState(() => `product-card-${Math.random().toString(36).slice(2, 11)}`)
	const [imageHeight, setImageHeight] = useState(180)
	const [imageUrl, setImagemUrl] = useState(null)

	const _onPressOnWishlist = e => {
		e.stopPropagation()
		onPressOnWishlist()
	}

	useEffect(() => {
		Eitri.environment.getRemoteConfigs().then(configs => {
			try {
				const aspectRatio = configs.appConfigs.productCardImageAspectRatio

				if (!aspectRatio) {
					setImagemUrl(image)
				}

				const cardContainerElement = document.getElementById(cardContainerId)
				if (!cardContainerElement) return

				const width = cardContainerElement.getBoundingClientRect().width

				if (!width) return

				const [aspectWidth, aspectHeight] = aspectRatio?.replace('x', ':').split(':')?.map(Number)

				const height = width * (aspectHeight / aspectWidth)

				const avoidResize = configs.appConfigs.productCardImageAvoidResize ?? false

				const imageUrl = avoidResize ? image : image?.replace(/\/ids\/(\d+)\//, `/ids/$1-${width}-${height}/`)

				setImagemUrl(imageUrl)
				setImageHeight(height)
			} catch (e) {
				setImagemUrl(image)
			}
		})
	}, [])

	return (
		<View
			onClick={onPressOnCard}
			className={`relative bg-white rounded-lg ${className}`}>
			<View className={`flex flex-col w-full shadow-md rounded`}>
				<View
					style={{ height: `${imageHeight}px`, maxHeight: `${imageHeight}px`, minHeight: `${imageHeight}px` }}
					className={`relative flex flex-col w-full justify-center items-center rounded-t`}>
					{imageUrl && (
						<Image
							className={`object-contain h-full w-full rounded-t`}
							src={imageUrl}
						/>
					)}

					<View
						onClick={_onPressOnWishlist}
						className='absolute top-[7px] p-2 right-[7px] flex items-center justify-center rounded-full backdrop-blur-sm bg-header-background z-[99] '>
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
					className={`mt-2 h-[36px] bg-primary w-full rounded-b-lg flex justify-center items-center border-primary-700 border-[0.5px] bg-primary-700 z-[99]`}>
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
