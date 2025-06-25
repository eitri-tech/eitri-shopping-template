import { Vtex } from 'eitri-shopping-vtex-shared'
import { HEADER_TYPE, HeaderTemplate, Loading } from 'shopping-vtex-template-shared'
import formatDate, { formatDateDaysMonthYear } from '../utils/Date'
import OrderStatusBadge from '../components/OrderList/OrderStatusBadge'
import OrderProductCard from '../components/OrderList/OrderProductCard'
import Eitri from 'eitri-bifrost'
import ProtectedView from '../components/ProtectedView/ProtectedView'
import { sendPageView } from '../services/TrackingService'
import { useTranslation } from 'eitri-i18n'
import { formatAmount } from '../utils/utils'

export default function OrderDetails(props) {
	const [order, setOrders] = useState(props?.history?.location?.state?.orderId)
	const [adress, setAdress] = useState('')
	const [products, setProducts] = useState('')
	const [orderSumary, setOrderSumary] = useState('')
	const [paymentDetails, setPaymentDetails] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	const [cancelConfirmation, setCancelConfirmation] = useState(false)
	const [cancelReason, setCancelReason] = useState('')

	const { t } = useTranslation()

	//const orderList = Vtex.customer.listOrders(0);
	useEffect(() => {
		try {
			const orderId = props?.history?.location?.state?.orderId
			if (!orderId) {
				Eitri.navigation.navigate({ path: 'OrderList', replace: true })
			}
			handleOrder(orderId)
			sendPageView('Detalhes do pedido')
		} catch (error) {
			console.log('deu erro', error)
		}
	}, [])

	const formatAmountInCents = amount => {
		if (typeof amount !== 'number') {
			return ''
		}
		if (amount === 0) {
			return t('orderDetails.lbFree')
		}
		return formatAmount(amount / 100)
	}

	const handleOrder = async id => {
		try {
			const orders = await Vtex.customer.getOrderById(id)
			setOrders(orders)
			setProducts(orders.items)
			setAdress(orders.shippingData.address)
			setPaymentDetails(orders.paymentData.transactions[0].payments[0])
			setOrderSumary(orders.totals)
			setIsLoading(false)
		} catch (error) {
			console.log('Erro ao pegar orders', error)
			Eitri.navigation.navigate({ path: 'OrderList', replace: true })
		}
	}

	const cancelOrder = async () => {
		try {
			setIsLoading(true)
			if (!cancelReason) {
				return
			}
			const payload = { reason: cancelReason }
			await Vtex.customer.cancelOrder(order.orderId, payload)
			Eitri.navigation.back()
		} catch (e) {
			console.log('Erro ao cancelar pedido', e)
		}
	}

	const getFormattedPaymentSystem = payment => {
		if (!payment) return null

		if (payment.paymentSystem === '6') {
			return (
				<View
					width='100%'
					display='flex'
					justifyContent='between'>
					<Text block>{payment.paymentSystemName} </Text>
					{order.status === 'payment-pending' && (
						<View onClick={() => Eitri.openBrowser({ url: payment.url })}>
							<Text
								block
								color='primary-500'
								fontWeight='bold'>
								{t('orderDetails.lbSeeBilling')}
							</Text>
						</View>
					)}
				</View>
			)
		}

		return (
			<Text>{`${payment.paymentSystemName} ${formatAmountInCents(payment.value)} (${
				payment.installments
			}x)`}</Text>
		)
	}

	const handleShippingEstimate = shippingEstimate => {
		return shippingEstimate.replace(/[a-zA-Z]/g, '')
	}

	return (
		<ProtectedView
			afterLoginRedirectTo={'OrderDetails'}
			redirectState={{ orderId: props?.history?.location?.state?.orderId }}>
			<Page
				bottomInset
				topInset>
				<HeaderTemplate
					headerType={HEADER_TYPE.RETURN_AND_TEXT}
					viewBackButton={true}
					contentText={t('orderDetails.title')}
				/>

				<View>
					{isLoading ? (
						<Loading fullScreen />
					) : (
						<View padding='small'>
							<View
								marginTop='medium'
								justify='center'
								align='left'
								borderRadius='medium'
								borderWidth='hairline'
								borderColor='neutral-500'>
								<View
									direction='column'
									gap='16px'
									padding='small'>
									<View
										display='flex'
										direction='row'
										alignItems='center'
										justifyContent='between'>
										<View
											direction='column'
											gap='5px'>
											<Text
												block
												fontSize='small'>
												{`[b]${t('orderDetails.lbOrder')}:[/b]`}
											</Text>
											<Text block>{order.orderId}</Text>
										</View>

										<OrderStatusBadge
											statusId={order.status}
											statusDescription={order.statusDescription}
										/>
									</View>

									<View
										direction='column'
										gap='5px'>
										<Text
											block
											fontSize='small'>
											{`[b]${t('orderDetails.lbOrderDate')}:[/b]`}
										</Text>
										<Text block>{formatDateDaysMonthYear(order.creationDate)}</Text>
									</View>

									<View
										direction='column'
										gap='5px'>
										<Text
											block
											fontSize='small'>
											{`[b]${t('orderDetails.lbAddress')}[/b]`}
										</Text>
										<View>
											<Text block>[b]{adress.receiverName}[/b]</Text>
											<View
												direction='column'
												display='flex'>
												<Text
													block
													fontSize='extra-small'>
													{`${adress.street}, ${adress.number} ${
														adress.complement ? ' - ' + adress.complement : ''
													}`}
												</Text>
												<Text
													block
													fontSize='extra-small'>
													{`${adress.city} - ${adress.state} - ${adress.neighborhood} - ${adress.postalCode}`}
												</Text>
											</View>
										</View>
									</View>

									<View
										width='100%'
										direction='column'
										gap='5px'>
										<Text fontSize='small'>{`[b]${t('orderDetails.lbPayment')}[/b]`}</Text>
										<View display='flex'>
											{order?.paymentData?.transactions[0]?.payments?.map(payment =>
												getFormattedPaymentSystem(payment)
											)}
										</View>
									</View>

									<View
										width='100%'
										direction='column'
										gap='5px'>
										<Text fontSize='small'>{`[b]${t('orderDetails.lbDelivery')}[/b]`}</Text>
										<View display='flex'>
											{order?.shippingData?.logisticsInfo[0]?.shippingEstimateDate ? (
												<Text
													block
													fontSize='extra-small'>{`${t('orderDetails.lbShippingUntil')} ${formatDate(order?.shippingData?.logisticsInfo[0]?.shippingEstimateDate)}`}</Text>
											) : (
												<Text
													block
													fontSize='extra-small'>{`${t('orderDetails.lbShippingDeadline')} ${handleShippingEstimate(order?.shippingData?.logisticsInfo[0]?.shippingEstimate)} ${t('orderDetails.lbShippingDeadlineInfo')}`}</Text>
											)}
										</View>
									</View>

									<View
										direction='column'
										gap='5px'>
										<Text
											block
											fontSize='small'>
											{`[b]${t('orderDetails.lbSumary')}[/b]`}
										</Text>
										<View direction='column'>
											{order &&
												order?.totals?.map(total => (
													<>
														{total.value > 0 && (
															<Text block>{`${total?.name}: ${formatAmountInCents(
																total.value
															)}`}</Text>
														)}
													</>
												))}
											<Text block>
												{`${t('orderDetails.lbTotal')}: ${
													orderSumary &&
													formatAmountInCents(
														orderSumary
															.map(item => item.value)
															.reduce((acc, curr) => acc + curr, 0)
													)
												}`}
											</Text>
										</View>
									</View>

									{order?.allowCancellation && (
										<View
											display='flex'
											alignItems='center'
											width='100%'>
											{cancelConfirmation ? (
												<View>
													<Text
														block
														fontSize='small'
														fontWeight='bold'>
														{t('orderDetails.lbCancelReason')}
													</Text>
													<Dropdown
														value={cancelReason}
														placeholder={t('orderDetails.lbSelectCancelReason')}
														onChange={value => setCancelReason(value)}>
														<Dropdown.Item
															value={t('orderDetails.valueCancelReasonNoMoreItems')}
															label={t('orderDetails.valueCancelReasonNoMoreItems')}
														/>
														<Dropdown.Item
															value={t('orderDetails.valueCancelReasonAccidentallyBuy')}
															label={t('orderDetails.valueCancelReasonAccidentallyBuy')}
														/>
														<Dropdown.Item
															value={t('orderDetails.valueCancelReasonSlowDelivery')}
															label={t('orderDetails.valueCancelReasonSlowDelivery')}
														/>
														<Dropdown.Item
															value={t('orderDetails.valueCancelReasonFoundABetterPrice')}
															label={t('orderDetails.valueCancelReasonFoundABetterPrice')}
														/>
														<Dropdown.Item
															value={t('orderDetails.valueCancelReasonPrefferNotInform')}
															label={t('orderDetails.valueCancelReasonPrefferNotInform')}
														/>
														<Dropdown.Item
															value={t('orderDetails.valueCancelReasonOther')}
															label={t('orderDetails.valueCancelReasonOther')}
														/>
													</Dropdown>
													<View
														display='flex'
														justifyContent='between'
														marginTop='small'>
														<View onClick={() => setCancelConfirmation(false)}>
															<Text
																block
																color='primary-700'
																fontSize='small'
																fontWeight='bold'>
																{t('orderDetails.lbBack')}
															</Text>
														</View>
														<View onClick={cancelOrder}>
															<Text
																block
																color={cancelReason ? 'negative-700' : ''}
																fontSize='small'
																fontWeight='bold'>
																{t('orderDetails.lbContinueCancel')}
															</Text>
														</View>
													</View>
												</View>
											) : (
												<View onClick={() => setCancelConfirmation(true)}>
													<Text
														block
														color='negative-700'
														fontWeight='bold'>
														{t('orderDetails.lbCancel')}
													</Text>
												</View>
											)}
										</View>
									)}
								</View>

								<View
									backgroundColor='neutral-100'
									borderTopWidth='hairline'
									borderColor='neutral-500'
									borderRadiusRightBottom='medium'
									borderRadiusLeftBottom='medium'
									padding='nano'>
									{products && (
										<OrderProductCard
											orderId={order.orderId}
											productItems={products}
											key='id'
											delivery={
												order.ShippingEstimatedDateMax &&
												formatDate(order.ShippingEstimatedDateMax)
											}
										/>
									)}
								</View>
							</View>
						</View>
					)}
				</View>
			</Page>
		</ProtectedView>
	)
}

// props?.location?.state?.product.productName
