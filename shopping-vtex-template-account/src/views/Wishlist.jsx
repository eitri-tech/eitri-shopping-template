import { getWishlist, removeFromWishlist } from '../services/CustomerService'
import WishlistItem from '../components/WishlistItem/WishlistItem'
import { HeaderContentWrapper, HeaderReturn, HeaderText, Loading, BottomInset } from 'eitri-shopping-montreal-shared'
import NoItem from '../components/NoItem/NoItem'
import { sendScreenView } from '../services/TrackingService'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function Wishlist(props) {
	const [wishlistItems, setWishlistItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		start()
		addonUserTappedActiveTabListener()
		sendScreenView('Lista de desejos', 'Wishlist')
	}, [])

	const start = async () => {
		try {
			setIsLoading(true)
			const result = await getWishlist()
			setWishlistItems(result)
			setIsLoading(false)
		} catch (e) {
			setWishlistItems([])
			setIsLoading(false)
		}
	}

	const onRemoveFromWishList = async id => {
		setIsLoading(true)
		try {
			await removeFromWishlist(id)
			setWishlistItems(prevItems => prevItems.filter(item => item.id !== id))
		} catch (error) {
			console.error(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Page title='Wishlist'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Meus favoritos'} />
			</HeaderContentWrapper>

			<Loading
				isLoading={isLoading}
				fullScreen
			/>

			<View className='grid grid-cols-2 gap-x-2 gap-y-4 p-4'>
				{wishlistItems?.map(item => (
					<WishlistItem
						key={item.id}
						productId={item.productId}
						onRemoveFromWishlist={() => onRemoveFromWishList(item.id)}
					/>
				))}
			</View>
			{wishlistItems.length === 0 && !isLoading && (
				<NoItem
					title='Você não possui nenhum item salvo'
					subtitle='Quando você salvar um produto, ele será listado aqui.'
				/>
			)}
			<BottomInset />
		</Page>
	)
}
