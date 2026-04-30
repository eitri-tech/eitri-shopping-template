import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText, Loading } from '_wicomm-shopping-shared'
import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import NoItem from '../components/NoItem/NoItem'
import WishlistItem from '../components/WishlistItem/WishlistItem'
import { getWishlist, removeFromWishlist } from '../services/CustomerService'
import { sendScreenView } from '../services/TrackingService'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function Wishlist(props) {
	const { t } = useTranslation()

	const [wishlistItems, setWishlistItems] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		start()

		addonUserTappedActiveTabListener()
		sendScreenView('Lista de desejos', 'Wishlist')

		Eitri.navigation.addOnResumeListener(() => start())
	}, [])

	const start = async () => {
		try {
			setIsLoading(true)
			const result = await getWishlist()

			setWishlistItems(result)
		} catch (e) {
			console.error('ERROR AO CARREGAR WISHLIST', err)
			setWishlistItems([])
		} finally {
			setIsLoading(false)
		}
	}

	const onRemoveFromWishList = async id => {
		setIsLoading(true)

		try {
			await removeFromWishlist(id)
			setWishlistItems(prevItems => prevItems.filter(item => item.id !== id))
		} catch (error) {
			console.error('Erro ao remover item da wishlist', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Page title={t('wishlist.pageTitle', 'Wishlist')}>
			<HeaderContentWrapper>
				<HeaderReturn />

				<HeaderText text={t('wishlist.myFavorites', 'Meus favoritos')} />
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
						onRemoveFromWishList={() => onRemoveFromWishList(item.id)}
					/>
				))}
			</View>

			{wishlistItems.length === 0 && !isLoading && (
				<NoItem
					title={t('wishlist.noItems', 'Você não possui nenhum item salvo')}
					subtitle={t('wishlist.noItemsSubtitle', 'Quando você salvar um produto, ele será listado aqui.')}
				/>
			)}

			<BottomInset />
		</Page>
	)
}
