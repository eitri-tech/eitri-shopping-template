import wishilist from '../../assets/icons/wishlist.svg'
import Rating from '../Rating/Rating'

export default function ProductCardVertical(props) {
	const {
		ratingValue,
		ratingsCount,
		listPrice,
		image,
		name,
		price,
		width,
		installments,
		onWishListPress,
		onPress,
		badge
	} = props

	const onPressCard = () => {
		if (onPress && typeof onPress === 'function') {
			onPress()
		}
	}

	return (
		<View
			position='relative'
			minWidth={width || 'auto'}
			maxWidth={width || 'auto'}
			borderRadius='small'
			padding='small'
			borderColor='neutral-500'
			borderWidth='hairline'>
			<View direction='column'>
				{badge ? (
					<View
						maxHeight='27px'
						minHeight='27px'
						borderRadius='pill'
						width='fit-content'
						backgroundColor='positive-300'
						paddingHorizontal='large'
						paddingVertical='quark'>
						<Text
							block
							fontWeight='bold'>
							{badge}
						</Text>
					</View>
				) : (
					<View height='27px' />
				)}

				<View
					display='flex'
					width='100%'
					justifyContent='center'
					borderRadius='micro'
					alignItems='center'>
					<Image
						src={image}
						maxWidth='100%'
						borderRadius='micro'
						maxHeight='100%'
					/>
				</View>

				<View
					marginTop='small'
					display='flex'
					justifyContent='between'
					maxHeight='36px'
					minHeight='36px'
					gap={4}>
					<Text
						block
						lineClamp={3}
						fontWeight='medium'
						fontSize='extra-small'>
						{name}
					</Text>
					<View
						zIndex={99}
						onPress={onWishListPress}>
						<Image
							src={wishilist}
							width='24px'
							height='24px'
						/>
					</View>
				</View>

				<View marginTop='quark'>
					{ratingValue ? (
						<Rating
							ratingValue={ratingValue}
							ratingsCount={ratingsCount}
						/>
					) : (
						<View height='16px' />
					)}
				</View>

				<View
					direction='column'
					gap={2}
					marginTop='nano'>
					{listPrice ? (
						<Text
							block
							textDecoration='line-through'
							fontWeight='bold'
							color='neutral-500'
							fontSize='nano'>
							{listPrice}
						</Text>
					) : (
						<View height='16px' />
					)}

					<Text
						block
						fontWeight='bold'
						color='primary-700'
						fontSize='small'>
						{price}
					</Text>

					{installments ? (
						<Text
							block
							fontWeight='bold'
							color='neutral-500'
							fontSize='nano'>
							{installments}
						</Text>
					) : (
						<View height='16px' />
					)}
				</View>
			</View>

			<View
				onPress={onPressCard}
				position='absolute'
				top='0'
				bottom='0'
				left='0'
				right='0'
			/>
		</View>
	)
}
