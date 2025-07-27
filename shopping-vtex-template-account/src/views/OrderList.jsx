import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { Loading, HeaderContentWrapper, HeaderText, HeaderReturn, CustomButton } from 'shopping-vtex-template-shared'
import NoItem from '../components/NoItem/NoItem'
import { sendPageView } from '../services/TrackingService'
import OrderCard from '../components/OrderCard/OrderCard'
import { listOrders } from '../services/CustomerService'

export default function OrderList(props) {
	const [orders, setOrders] = useState({})

	const [loading, setLoading] = useState(true)

	const [isLoading, setIsLoading] = useState(false)

	const [productItems, setProductItems] = useState([])
	const [scrollEnded, setScrollEnded] = useState(false)

	const [page, setPage] = useState(1)
	const [maxPages, setMaxPages] = useState(2)

	const numberItemsLoadedOnEnter = 3

	useEffect(() => {
		handleOrders()
		sendPageView('Pedidos')
	}, [])

	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
				setScrollEnded(true)
			}
		}
		window.addEventListener('scroll', handleScroll)
		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		if (scrollEnded) {
			handleMoreOrders()
		}
	}, [scrollEnded])

	const formatAmountInCents = amount => {
		if (typeof amount !== 'number') {
			return ''
		}
		if (amount === 0) {
			return 'Grátis'
		}
		return (amount / 100).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
	}

	const handleMoreOrders = async () => {
		if (maxPages >= page) {
			if (isLoading) return
			setIsLoading(true)
			const willLoadPage = page + 1
			try {
				const moreOrders = await Vtex.customer.listOrders(willLoadPage)
				const moreOrdersList = moreOrders.list
				setOrders(prevOrders => [...prevOrders, ...moreOrdersList])
				setPage(willLoadPage)
			} catch (error) {
				console.error('erro ao buscar novas ordens  ->', error)
			}
			setScrollEnded(false)
			setIsLoading(false)
		}
	}

	const handleOrders = async () => {
		try {
			const orders = await listOrders()
			setMaxPages(orders?.paging?.pages)
			const firstIds = orders.list.slice(0, numberItemsLoadedOnEnter)
			const productItems = await Promise.all(
				firstIds.map(async orderItem => {
					const orderProducts = await Vtex.customer.getOrderById(orderItem.orderId)
					return orderProducts
				})
			)
			setProductItems(productItems)
			setOrders(orders.list)
			setLoading(false)
		} catch (error) {
			console.log('erro ao buscar orders', error)
		}
	}

	return (
		<ProtectedView afterLoginRedirectTo={'OrderList'}>
			<Page>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={'Meus Pedidos'} />
				</HeaderContentWrapper>

				<Loading
					isLoading={isLoading}
					fullScreen
				/>

				<View className='p-4'>
					<>
						{orders && orders.length >= 1 ? (
							orders.map((item, key) => (
								<OrderCard
									key={item.orderId}
									order={item}
									showOrderDetails={key < 3}
								/>
							))
						) : (
							<NoItem
								title='Você não possui nenhum pedido'
								subtitle='Quando você fizer uma compra, ela será listada aqui.'
							/>
						)}
					</>

					{isLoading && <Loading inline={true} />}
				</View>
			</Page>
		</ProtectedView>
	)
}
