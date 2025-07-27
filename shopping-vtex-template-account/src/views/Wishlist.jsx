import { getWishlist, removeFromWishlist } from '../services/CustomerService'
import WishlistItem from '../components/WishlistItem/WishlistItem'
import { HeaderContentWrapper, HeaderReturn, HeaderText, Loading } from 'shopping-vtex-template-shared'
import NoItem from '../components/NoItem/NoItem'
import { sendPageView } from '../services/TrackingService'

export default function Wishlist(props) {
	const [wishlistItems, setWishlistItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		start()
		sendPageView('Lista de desejos')
	}, [])

	const start = async () => {
		try {
			setIsLoading(true)
			const result = await getWishlist()
			console.log('result', result)
			setWishlistItems(result)
			setIsLoading(false)
		} catch (e) {
			console.log('Error:', e)
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
		<Page
			bottomInset
			topInset>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={'Meus favoritos'} />
			</HeaderContentWrapper>

			<Loading
				isLoading={isLoading}
				fullScreen
			/>

			{/*
			  A implementação anterior foi refatorada para usar o sistema de grid do Tailwind.
			  Isso simplifica o código, corrige um bug de layout com itens ímpares e é mais performático.
			  O layout de duas colunas é mantido com espaçamento consistente.
			*/}
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
		</Page>
	)
}
