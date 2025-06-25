import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { Loading, HeaderTemplate, HEADER_TYPE, CustomButton } from 'shopping-vtex-template-shared'
import formatDate, { formatDateDaysMonthYear } from '../utils/Date'
import OrderListDetails from '../components/OrderList/OrderListDetails'
import OrderProductCard from '../components/OrderList/OrderProductCard'
import NoItem from '../components/NoItem/NoItem'
import { sendPageView } from '../services/TrackingService'

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
			const orders = await Vtex.customer.listOrders()
			setMaxPages(orders.paging.pages)
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
			<Page
				bottomInset
				topInset>
				<HeaderTemplate
					headerType={HEADER_TYPE.RETURN_AND_TEXT}
					viewBackButton={true}
					contentText={'Meus Pedidos'}
				/>
				<View padding='small'>
					{loading ? (
						<Loading fullScreen />
					) : (
						<>
							{orders && orders.length >= 1 ? (
								orders.map((item, key) => (
									<View
										marginTop='medium'
										justify='center'
										align='left'
										borderRadius='medium'
										borderWidth='hairline'
										borderColor='neutral-300'
										key={item.orderId}>
										<OrderListDetails
											creationDate={formatDateDaysMonthYear(item.creationDate)}
											order={item.orderId}
											totalItems={item.totalItems}
											totalValue={formatAmountInCents(item.totalValue)}
											statusId={item.status}
											statusDescription={item.statusDescription}
										/>
										<View>
											{key < 3 && (
												<OrderProductCard
													productItems={productItems[key].items}
													isLoading={true}
													delivery={
														item.ShippingEstimatedDateMax &&
														formatDate(item.ShippingEstimatedDateMax)
													}
												/>
											)}
											<View
												marginTop='small'
												padding='small'>
												<CustomButton
													width='100%'
													label={'Ver detalhes do pedido'}
													onPress={() =>
														Eitri.navigation.navigate({
															path: '/OrderDetails',
															state: { orderId: item.orderId }
														})
													}
												/>
											</View>
										</View>
									</View>
								))
							) : (
								<NoItem
									title='Você não possui nenhum pedido'
									subtitle='Quando você fizer uma compra, ela será listada aqui.'
								/>
							)}
						</>
					)}
					{isLoading && <Loading inline={true} />}
				</View>
			</Page>
		</ProtectedView>
	)
}
