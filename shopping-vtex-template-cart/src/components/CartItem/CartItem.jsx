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
	const {
		item,
		onChangeQuantityItem,
		message,
		handleRemoveCartItem,
		onAddOfferingToCart,
		onRemoveOfferingFromCart,
		locale,
		currency
	} = props
	const [loadingWishlist, setLoadingWishlist] = useState(false)
	const [wishlistId, setWishlistId] = useState('')
	const [showModalRemoveItem, setShowModalRemoveItem] = useState(false)

	const resizedImageUrl = item.imageUrl.replace('60-60', '200-200')

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
		onChangeQuantityItem(item.quantity + quantityToUpdate, item.itemIndex)
	}

	const removeCartItem = confirm => {
		if (confirm) {
			handleModalRemoveItem()
			handleRemoveCartItem(item.itemIndex)
			return
		}
		handleModalRemoveItem()
	}

	const handleModalRemoveItem = () => {
		setShowModalRemoveItem(!showModalRemoveItem)
	}

	return (
		<View>
			<View className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4'>
				<View className='flex gap-4'>
					<View className='flex-shrink-0'>
						<Image
							className='w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg'
							src={resizedImageUrl}
						/>
					</View>

					<View className='flex-1 min-w-0'>
						<View className='flex justify-between items-start mb-2'>
							<Text className='text-sm font-medium text-gray-900 pr-2'>{item.name}</Text>
							<View className='flex-shrink-0 flex flex-col gap-2'>
								<View onClick={handleModalRemoveItem}>
									<Image
										className='h-5'
										src={trash}
									/>
								</View>
							</View>
						</View>

						{/* Preço */}
						<View className='mb-3'>
							<Text className='text-lg font-bold text-gray-900'>{formatAmountInCents(item.price)}</Text>
						</View>

						{/* Seletor de Quantidade */}
						<View className='flex items-center justify-between'>
							<View className='flex items-center gap-3'>
								<Text className='text-sm text-gray-600'>Qtd:</Text>
								<Quantity
									quantity={item.quantity}
									handleItemQuantity={handleQuantityOfItemsCart}
								/>
							</View>
							<View
								onClick={handleModalRemoveItem}
								className='text-gray-400 hover:text-red-500 transition-colors'>
								<Image
									className='h-5'
									src={trash}
								/>
							</View>
						</View>

						{/*<View className='border-t border-gray-100 pt-3'>*/}
						{/*	<View className='flex items-center justify-between'>*/}
						{/*		<View className='flex items-center gap-2'>*/}
						{/*			<View>*/}
						{/*				<Text className='text-sm font-medium text-gray-900'>Garantia Estendida</Text>*/}
						{/*			</View>*/}
						{/*		</View>*/}
						{/*		<View className='flex items-center gap-2'>*/}
						{/*			<Text className='text-sm font-medium text-green-600'>+R$ 20</Text>*/}
						{/*			<View*/}
						{/*				onClick={() => console.log('aqui')}*/}
						{/*				className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${*/}
						{/*					false ? 'bg-blue-600' : 'bg-gray-300'*/}
						{/*				}`}>*/}
						{/*				<View*/}
						{/*					className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${*/}
						{/*						false ? 'translate-x-5' : 'translate-x-1'*/}
						{/*					}`}*/}
						{/*				/>*/}
						{/*			</View>*/}
						{/*		</View>*/}
						{/*	</View>*/}
						{/*</View>*/}

						{/*<Text className='text-neutral-900 font-medium text-sm'>{item.name}</Text>*/}
						{/*<Text className='text-primary-700 font-bold text-base'>*/}
						{/*	{formatAmountInCents(item.price, locale, currency)}*/}
						{/*</Text>*/}
						{/*{item?.offerings?.length > 0 &&*/}
						{/*	!message &&*/}
						{/*	item?.offerings*/}
						{/*		?.filter(o => !o.isBundled)*/}
						{/*		.map((offering, index) => (*/}
						{/*			<Button*/}
						{/*				key={offering.id + index}*/}
						{/*				onClick={() => onAddOfferingToCart(item.itemIndex, offering.id)}*/}
						{/*				className='border border-primary-700 rounded-lg p-2 flex justify-center items-center'>*/}
						{/*				<Text className='text-sm text-primary-700 font-medium'>*/}
						{/*					{`${t('cartItem.txtAdd')} ${offering?.name} ${offering?.price ? formatAmountInCents(offering.price, locale, currency) : ''}`}*/}
						{/*				</Text>*/}
						{/*			</Button>*/}
						{/*		))}*/}
						{/*<View className='flex justify-between h-[30%] items-center'>*/}
						{/*	{!message && (*/}
						{/*		<Quantity*/}
						{/*			quantity={item.quantity}*/}
						{/*			handleItemQuantity={handleQuantityOfItemsCart}*/}
						{/*		/>*/}
						{/*	)}*/}
						{/*	{loadingWishlist ? (*/}
						{/*		<View>*/}
						{/*			<Loading width='30px' />*/}
						{/*		</View>*/}
						{/*	) : (*/}
						{/*		<SaveButton*/}
						{/*			handleSaveFavorite={() => handleSaveFavorite(item.id)}*/}
						{/*			isInWishlist={!!wishlistId}*/}
						{/*		/>*/}
						{/*	)}*/}
						{/*</View>*/}
					</View>
				</View>

				{item?.offerings?.length > 0 && !message && (
					<View className='mt-4 pt-3 border-t border-gray-100'>
						{item?.offerings
							?.filter(o => !o.isBundled)
							.map((offering, index) => (
								<View className='flex items-top justify-between gap-4'>
									<View className='flex items-top gap-3'>
										<Toggle
											defaultChecked
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

			{item?.offerings?.length > 0 &&
				item?.offerings
					?.filter(o => o.isBundled)
					.map((offering, index) => (
						<View
							key={offering.id + index}
							className='bg-neutral-100'>
							<View className='bg-background-color w-full h-0.5' />
							<View className='py-2 px-6 flex justify-between items-center'>
								<Text className='text-sm font-medium'>
									{`${offering?.name}: ${offering?.price ? formatAmountInCents(offering.price, locale, currency) : ''}`}
								</Text>
								<Button onClick={() => onRemoveOfferingFromCart(item.itemIndex, offering.id)}>
									<Image
										className='h-4'
										src={trash}
									/>
								</Button>
							</View>
						</View>
					))}
			{/*<ModalConfirm*/}
			{/*	text={t('cartItem.txtRemoveCart')}*/}
			{/*	showModal={showModalRemoveItem}*/}
			{/*	closeModal={handleModalRemoveItem}*/}
			{/*	removeItem={removeCartItem}*/}
			{/*/>*/}
		</View>
	)
}
