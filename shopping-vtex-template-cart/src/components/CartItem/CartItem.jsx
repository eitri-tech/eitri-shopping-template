import { View, Text, Button, Image } from 'eitri-luminus'
import trash from '../../assets/images/trash-01.svg'
import Quantity from '../Quantity/Quantity'
import SaveButton from '../SaveButton/SaveButton'
import { Loading } from 'shopping-vtex-template-shared'
import { addToWishlist, checkWishlistItem, removeItemFromWishlist } from '../../services/customerService'
import ModalConfirm from '../ModalConfirm/ModalConfirm'
import { useTranslation } from 'eitri-i18n'
import { formatAmountInCents } from '../../utils/utils'

export default function CartItem(props) {
	const { item, onChangeQuantityItem, message, handleRemoveCartItem, onAddOfferingToCart, onRemoveOfferingFromCart } =
		props
	const [loadingWishlist, setLoadingWishlist] = useState(false)
	const [wishlistId, setWishlistId] = useState('')
	const [showModalRemoveItem, setShowModalRemoveItem] = useState(false)
	const [modalRemoveItemText, setModalRemoveItemText] = useState('')
	const resizedImageUrl = item.imageUrl.replace(/\/(\d+)-\d+-\d+\//, '/$1-200-200/')

	const { t } = useTranslation()

	useEffect(() => {
		checkWishlist()
	}, [])

	const checkWishlist = async () => {
		setLoadingWishlist(true)
		const { inList, listId } = await checkWishlistItem(item.productId)
		if (inList) {
			setWishlistId(listId)
		}
		setLoadingWishlist(false)
	}

	const handleSaveFavorite = async () => {
		try {
			setLoadingWishlist(true)
			if (wishlistId) {
				await removeItemFromWishlist(wishlistId)
				setWishlistId('')
			} else {
				const result = await addToWishlist(item.productId, item.name, item.id)
				setWishlistId(result?.data?.addToList)
			}
			setLoadingWishlist(false)
		} catch (e) {
			setLoadingWishlist(false)
		}
	}

	const handleQuantityOfItemsCart = quantityToUpdate => {
		onChangeQuantityItem(item.quantity + quantityToUpdate)
	}

	const handleRemoveCartItemIntention = () => {
		setModalRemoveItemText(`Deseja remover ${item.name} do carrinho?`)
		setShowModalRemoveItem(true)
	}

	const removeCartItem = confirm => {
		handleRemoveCartItem()
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
						<View className='flex items-center gap-2'>
							<Quantity
								quantity={item.quantity}
								handleItemQuantity={handleQuantityOfItemsCart}
							/>
							<View onClick={removeCartItem}>
								<Text className='flex items-center text-gray-400 size-3'>Excluir</Text>
							</View>
						</View>
					</View>
				</View>

				{item?.offerings?.length > 0 && !message && (
					<View className='mt-4 pt-3 border-t border-gray-300'>
						{item?.offerings.map(offering => (
							<View
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
				removeItem={handleRemoveCartItemIntention}
			/>
		</View>
	)
}
