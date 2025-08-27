import { View, Text, Image } from 'eitri-luminus'
import Quantity from '../Quantity/Quantity'
import { HeaderWishList, Loading } from 'shopping-vtex-template-shared'
import { addToWishlist, checkWishlistItem, removeItemFromWishlist } from '../../services/customerService'
import ModalConfirm from '../ModalConfirm/ModalConfirm'
import { useTranslation } from 'eitri-i18n'
import { formatAmountInCents } from '../../utils/utils'

export default function CartItem(props) {
	const { item, onChangeQuantityItem, message, handleRemoveCartItem, onAddOfferingToCart, onRemoveOfferingFromCart } =
		props
	const { t } = useTranslation()

	const [wishlistId, setWishlistId] = useState('')
	const [showModalRemoveItem, setShowModalRemoveItem] = useState(false)
	const [modalRemoveItemText, setModalRemoveItemText] = useState('')
	const [loadingItemQuantity, setLoadingItemQuantity] = useState(false)

	const resizedImageUrl = item.imageUrl.replace(/\/(\d+)-\d+-\d+\//, '/$1-200-200/')

	useEffect(() => {
		checkWishlist()
	}, [])

	const checkWishlist = async () => {
		const { inList, listId } = await checkWishlistItem(item.productId)
		if (inList) {
			setWishlistId(listId)
		}
	}

	const handleSaveFavorite = async () => {
		const wishlistIdStatus = wishlistId

		try {
			if (wishlistId) {
				setWishlistId('')
				await removeItemFromWishlist(wishlistId)
			} else {
				setWishlistId(true)
				const result = await addToWishlist(item.productId, item.name, item.id)
				setWishlistId(result?.data?.addToList)
			}
		} catch (e) {
			setWishlistId(wishlistIdStatus)
		}
	}

	const handleQuantityOfItemsCart = async quantityToUpdate => {
		try {
			setLoadingItemQuantity(true)
			await onChangeQuantityItem(item.quantity + quantityToUpdate)
			setLoadingItemQuantity(false)
		} catch (e) {
			setLoadingItemQuantity(false)
		}
	}

	const handleRemoveCartItemIntention = () => {
		setModalRemoveItemText(`Deseja remover ${item.name} do carrinho?`)
		setShowModalRemoveItem(true)
	}

	const removeCartItem = () => {
		handleRemoveCartItem()
		setShowModalRemoveItem(false)
	}

	const handleItemOffer = offeringId => {
		if (offerIsBundled(offeringId)) {
			onRemoveOfferingFromCart(offeringId)
			return
		}
		onAddOfferingToCart(offeringId)
	}

	const offerIsBundled = offeringId => {
		return item?.bundleItems?.some(o => o.id === offeringId)
	}

	return (
		<View>
			<View className='bg-white rounded shadow-sm border border-gray-300 p-4'>
				<View className='flex gap-4'>
					<View className='flex-shrink-0'>
						<Image
							className='w-20 h-20 object-cover rounded'
							src={resizedImageUrl}
						/>
					</View>

					<View className='flex-1 min-w-0'>
						{item.availability !== 'available' && (
							<View className='mb-2 p-2 bg-red-50 border border-red-200 rounded'>
								<Text className='text-sm text-red-600 font-medium'>
									{item.availability === 'cannotBeDelivered'
										? t('cartItem.cannotBeDelivered', 'Este item não pode ser entregue')
										: t('cartItem.notAvailable', 'Este item não está disponível')}
								</Text>
							</View>
						)}

						<View className='flex justify-between items-start mb-2'>
							<Text className='text-sm font-medium text-gray-900 pr-2'>{item.name}</Text>
						</View>

						{/* Preço */}
						<View className='mb-3'>
							<Text className='text-lg font-bold text-gray-900'>
								{formatAmountInCents(item.priceDefinition.total)}
							</Text>
						</View>

						{/* Seletor de Quantidade */}
						<View className='flex items-center gap-2 justify-between'>
							<View className='flex items-center gap-2'>
								{loadingItemQuantity ? (
									<View className='w-[101px] h-[37px] flex justify-center items-center'>
										<Loading />
									</View>
								) : (
									<Quantity
										quantity={item.quantity}
										handleItemQuantity={handleQuantityOfItemsCart}
									/>
								)}

								<HeaderWishList
									onClick={handleSaveFavorite}
									className='text-gray-400'
									filled={!!wishlistId}
								/>
							</View>

							<View onClick={handleRemoveCartItemIntention}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className='text-gray-400'>
									<polyline points='3 6 5 6 21 6'></polyline>
									<path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path>
									<line
										x1='10'
										y1='11'
										x2='10'
										y2='17'></line>
									<line
										x1='14'
										y1='11'
										x2='14'
										y2='17'></line>
								</svg>
							</View>
						</View>
					</View>
				</View>

				{item?.offerings?.length > 0 && !message && (
					<View className='mt-4 pt-3 border-t border-gray-300'>
						{item?.offerings.map(offering => (
							<View
								key={offering.id}
								onClick={() => handleItemOffer(offering.id)}
								className='flex items-top justify-between gap-4'>
								<View className='flex items-top gap-3'>
									<Toggle
										defaultChecked={offerIsBundled(offering.id)}
										name='terms'
										value={1}
									/>
									<View>
										<Text className='text-sm text-gray-700'>{offering?.name}</Text>
									</View>
								</View>
								<Text className='text-sm font-medium text-gray-900'>
									{offering?.price ? formatAmountInCents(offering.price) : ''}
								</Text>
							</View>
						))}
					</View>
				)}

				{message && (
					<View className='flex flex-col justify-center items-center'>
						<View className={'h-[10px]'} />
						<Text className='text-center text-tertiary-500'>
							{message.text || t('cartItem.txtMessageUnavailable')}
						</Text>
						<View className={'h-[10px]'} />
					</View>
				)}
			</View>

			<ModalConfirm
				text={modalRemoveItemText}
				showModal={showModalRemoveItem}
				closeModal={() => setShowModalRemoveItem(false)}
				removeItem={removeCartItem}
			/>
		</View>
	)
}
