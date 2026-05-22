import Eitri from 'eitri-bifrost'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { useTranslation } from 'eitri-i18n'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	Loading,
	BottomInset,
	GenericBox
} from 'shopping-vtex-template-shared'
import { formatDateDaysMonthYear, formatPriceInCents } from '../utils/utils'
import OrderStatusBadge from '../components/OrderStatusBadge/OrderStatusBadge'
import ProtectedView from '../components/ProtectedView/ProtectedView'
import { getOrderById } from '../services/CustomerService'
import ImageCard from '../components/Image/ImageCard'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'
import { sendScreenView } from '../services/TrackingService'
import OrderStatusTimeline from '../components/OrderStatusTimeline/OrderStatusTimeline'
import { CANCELED_STATUSES } from '../utils/getFullOrderState'

// Componente auxiliar para padronizar as seções de detalhes
const DetailSection = ({ title, children }) => (
	<View className='flex flex-col gap-1'>
		<Text className='text-sm font-semibold text-gray-800'>{title}</Text>
		<View>{children}</View>
	</View>
)

export default function OrderDetails(props) {
	const [order, setOrder] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [cancelConfirmation, setCancelConfirmation] = useState(false)
	const [cancelReason, setCancelReason] = useState('')

	const { t } = useTranslation()

	useEffect(() => {
		const { order, orderId } = props?.history?.location?.state

		if (order) {
			setOrder(order)
		} else if (orderId) {
			handleOrder(orderId)
		} else {
			Eitri.navigation.back()
			return
		}

		addonUserTappedActiveTabListener()
		sendScreenView('Detalhes do pedido', 'OrderDetails')
	}, [])

	const handleOrder = async id => {
		setIsLoading(true)
		try {
			const orderData = await getOrderById(id)
			setOrder(orderData)
		} catch (error) {
			console.error('Erro ao pegar detalhes do pedido:', error)
			Eitri.navigation.back()
		} finally {
			setIsLoading(false)
		}
	}

	const cancelOrder = async () => {
		if (!cancelReason) return
		setIsLoading(true)
		try {
			await Vtex.customer.cancelOrder(order?.orderId, { reason: cancelReason })
			Eitri.navigation.back()
		} catch (e) {
			console.error('Erro ao cancelar pedido', e)
			setIsLoading(false) // Garante que o loading para em caso de erro
		}
	}

	const getFormattedPaymentSystem = payment => {
		if (!payment) return null

		// Boleto
		if (payment.paymentSystem === '6') {
			return (
				<View className='flex w-full items-center justify-between'>
					<Text className='text-sm text-gray-700'>{payment.paymentSystemName}</Text>
					{order?.status === 'payment-pending' && (
						<View
							className='cursor-pointer'
							onClick={() => Eitri.openBrowser({ url: payment.url })}>
							<Text className='text-sm font-bold text-blue-600 hover:underline'>
								{t('orderDetails.lbSeeBilling')}
							</Text>
						</View>
					)}
				</View>
			)
		}

		// Outros (Cartão, etc)
		const name = payment.paymentSystemName || ''
		const value = payment.value ? ` ${formatPriceInCents(payment.value)}` : ''
		const installments = payment.installments > 1 ? ` (${payment.installments}x)` : ''
		return <Text className='text-sm text-gray-700'>{`${name}${value}${installments}`}</Text>
	}

	const handleShippingEstimate = shippingEstimate => {
		return shippingEstimate.replace(/[a-zA-Z]/g, '')
	}

	if (isLoading) {
		return (
			<Page>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('orderDetails.title')} />
				</HeaderContentWrapper>
				<Loading fullScreen />
			</Page>
		)
	}

	if (!order) {
		return
	}

	return (
		<ProtectedView
			afterLoginRedirectTo={'OrderDetails'}
			redirectState={{ orderId: order?.orderId }}>
			<Page title={'Detalhes do pedido'}>
				<HeaderContentWrapper>
					<HeaderReturn />
					<HeaderText text={t('orderDetails.title')} />
				</HeaderContentWrapper>

				<View className='p-4'>
					{/* Bloco principal de informações */}
					<View className='flex flex-col gap-2'>
						<Text className='text-xl'>{t('orderDetails.order', { orderId: order?.orderId })}</Text>
						<OrderStatusBadge
							order={order}
							statusId={order?.status}
							statusDescription={order?.statusDescription}
						/>
					</View>
				</View>

				<View className={'p-4 flex flex-col gap-4'}>
					<GenericBox>
						<Text className={'font-bold'}>
							{order?.shippingData?.address?.addressType !== 'residential'
								? t('orderDetails.addressPickup')
								: t('orderDetails.addressDelivery')}
						</Text>
						<View className='flex flex-col'>
							<Text className='text-sm text-gray-700'>
								{`${order?.shippingData?.address?.street}, ${order?.shippingData?.address?.number}${
									order?.shippingData?.address?.complement
										? ` - ${order?.shippingData?.address?.complement}`
										: ''
								}`}
							</Text>
							<Text className='text-sm text-gray-700'>
								{`${order?.shippingData?.address?.neighborhood}, ${order?.shippingData?.address?.city} - ${order?.shippingData?.address?.state}, ${order?.shippingData?.address.postalCode}`}
							</Text>
						</View>
					</GenericBox>

					<GenericBox>
						<Text className={'font-bold'}>{t('orderDetails.payment')}</Text>
						{order?.paymentData?.transactions[0]?.payments?.map((payment, index) => (
							<View key={index}>{getFormattedPaymentSystem(payment)}</View>
						))}
					</GenericBox>

					<GenericBox>
						<Text className={'font-bold'}>{t('orderDetails.summary')}</Text>
						<View className='flex flex-col text-sm text-gray-700'>
							{order?.totals?.map(
								total =>
									total.value > 0 && (
										<View
											key={total.id}
											className='flex justify-between'>
											<Text>{total?.name}:</Text>
											<Text>{formatPriceInCents(total.value)}</Text>
										</View>
									)
							)}
							<View className='mt-2 flex justify-between border-t border-gray-200 pt-2'>
								<Text className='font-bold text-gray-900'>{`${t('orderDetails.lbTotal')}:`}</Text>
								<Text className='font-bold text-gray-900'>
									{formatPriceInCents(
										order?.totals.map(item => item.value).reduce((acc, curr) => acc + curr, 0)
									)}
								</Text>
							</View>
						</View>
					</GenericBox>

					{!CANCELED_STATUSES.includes(order.status) && (
						<GenericBox>
							<OrderStatusTimeline order={order} />
						</GenericBox>
					)}

					<View>
						{order?.packageAttachment?.packages?.length > 0 ? (
							<>
								<Text className='block font-bold text-gray-900 mb-2'>{t('orderDetails.packages')}</Text>
								{order.packageAttachment.packages.map((pkg, index) => {
									const firstItemIndex = pkg.items?.[0]?.itemIndex ?? 0
									const logistics = order.shippingData?.logisticsInfo?.find(
										l => l.itemIndex === firstItemIndex
									)
									const deliveryChannel = logistics?.selectedDeliveryChannel
									const tipoEnvio =
										deliveryChannel === 'pickup-in-point'
											? t('orderDetails.packagePickup')
											: t('orderDetails.packageDelivery')
									const transportadora = logistics?.deliveryCompany
									const deliveredDate = pkg.courierStatus?.deliveredDate
									const estimatedDate = logistics?.shippingEstimateDate
									const dataEntrega = deliveredDate ?? estimatedDate

									return (
										<GenericBox
											key={index}
											className='flex flex-col gap-3'>
											{/* Cabeçalho do pacote */}
											<View className='flex flex-row items-center justify-between'>
												<Text className='text-sm font-semibold text-gray-800'>
													{t('orderDetails.package', { number: index + 1 })}
												</Text>
												{deliveredDate && (
													<View className='bg-green-100 px-2 py-0.5 rounded-full'>
														<Text className='text-xs font-medium text-green-700'>
															{deliveryChannel === 'pickup-in-point'
																? t('orderDetails.packagePickedUp')
																: t('orderDetails.packageDelivered')}
														</Text>
													</View>
												)}
											</View>

											{/* Informações de envio */}
											<View className='flex flex-col gap-2 bg-gray-50 rounded-md p-2'>
												{tipoEnvio && (
													<View className='flex flex-row justify-between'>
														<Text className='text-sm text-gray-500'>
															{t('orderDetails.packageDeliveryType')}
														</Text>
														<Text className='text-sm font-medium text-gray-800'>
															{tipoEnvio}
														</Text>
													</View>
												)}
												{transportadora && (
													<View className='flex flex-row justify-between'>
														<Text className='text-sm text-gray-500'>
															{t('orderDetails.packageCarrier')}
														</Text>
														<Text className='text-sm font-medium text-gray-800'>
															{transportadora}
														</Text>
													</View>
												)}
												{dataEntrega && (
													<View className='flex flex-row justify-between items-center'>
														<Text className='text-sm text-gray-500'>
															{deliveredDate
																? t('orderDetails.packageDeliveredOn')
																: t('orderDetails.packageEstimatedDelivery')}
														</Text>
														<Text className='text-sm font-medium text-gray-800'>
															{formatDateDaysMonthYear(dataEntrega)}
														</Text>
													</View>
												)}

												{pkg.invoiceKey && (
													<View className='flex flex-row justify-between items-center'>
														<Text className='text-sm text-gray-500'>
															{t('orderDetails.packageNFe')}
														</Text>
														<View
															onClick={() =>
																Eitri.openBrowser({
																	url: pkg?.invoiceUrl?.includes(
																		'www.nfe.fazenda.gov.br'
																	)
																		? pkg.invoiceUrl
																		: `https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?nfe=${pkg.invoiceKey}`,
																	inApp: true
																})
															}>
															<Text className='text-sm font-bold text-blue-600'>
																{t('orderDetails.packageAccess')}
															</Text>
														</View>
													</View>
												)}
												{pkg.trackingNumber && (
													<View className='flex flex-row justify-between items-center'>
														<Text className='text text-gray-500'>
															{t('orderDetails.packageTracking')}
														</Text>
														{pkg.trackingUrl && (
															<View
																onClick={() =>
																	Eitri.openBrowser({
																		url: pkg.trackingUrl,
																		inApp: true
																	})
																}>
																<Text className='text-sm font-bold text-blue-600'>
																	{t('orderDetails.packageTrack')}
																</Text>
															</View>
														)}
													</View>
												)}
											</View>

											{/* Produtos do pacote */}
											<View className='flex flex-col gap-2'>
												{pkg.items?.map((pkgItem, i) => {
													const product = order.items[pkgItem.itemIndex]
													if (!product) return null
													return (
														<View
															key={i}
															className='flex items-center gap-x-3'>
															<ImageCard
																imageUrl={product.imageUrl}
																className='w-14 h-14 rounded-md object-cover'
															/>
															<View className='flex flex-1 flex-col justify-center'>
																<Text className='text-sm text-gray-800 font-medium line-clamp-2 mb-0.5'>
																	{product.name}
																</Text>
																<Text className='text-xs text-gray-500'>
																	{`${pkgItem.quantity} un. • ${formatPriceInCents(pkgItem.price)}`}
																</Text>
															</View>
														</View>
													)
												})}
											</View>
										</GenericBox>
									)
								})}
							</>
						) : (
							<>
								<Text className='block font-bold text-gray-900 mb-2'>
									{t('orderDetails.orderProducts')}
								</Text>
								<GenericBox className='flex flex-col gap-2'>
									{order.items?.map((item, index) => (
										<View
											key={item.uniqueId || index}
											className='flex items-center gap-x-3'>
											<ImageCard
												imageUrl={item.imageUrl}
												className='w-14 h-14 rounded-md object-cover'
											/>
											<View className='flex flex-1 flex-col justify-center'>
												<Text className='text-sm text-gray-800 font-medium line-clamp-2 mb-0.5'>
													{item.name}
												</Text>
												<Text className='text-xs text-gray-500'>
													{`${item.quantity} un. • ${formatPriceInCents(item.sellingPrice)}`}
												</Text>
											</View>
										</View>
									))}
								</GenericBox>
							</>
						)}
					</View>

					{order?.allowCancellation && (
						<GenericBox>
							<View className='flex w-full items-center justify-center'>
								{cancelConfirmation ? (
									<View className='w-full'>
										<Text className='mb-2 block text-sm font-bold text-gray-800'>
											{t('orderDetails.lbCancelReason')}
										</Text>
										<Select
											className='select select-bordered w-full'
											value={cancelReason}
											placeholder={t('orderDetails.lbSelectCancelReason')}
											onChange={e => {
												const val = e.target ? e.target.value : e
												setCancelReason(val)
											}}>
											<Select.Item value='Não quero mais este produto.'>
												{t('orderDetails.valueCancelReasonNoMoreItems')}
											</Select.Item>
											<Select.Item value='Comprei sem querer.'>{t('orderDetails.valueCancelReasonAccidentallyBuy')}</Select.Item>
											<Select.Item value='A entrega vai demorar demais.'>
												{t('orderDetails.valueCancelReasonSlowDelivery')}
											</Select.Item>
											<Select.Item value='Encontrei um preço melhor em outro lugar.'>
												{t('orderDetails.valueCancelReasonFoundABetterPrice')}
											</Select.Item>
											<Select.Item value='Prefiro não informar.'>
												{t('orderDetails.valueCancelReasonPrefferNotInform')}
											</Select.Item>
											<Select.Item value='Outro'>{t('orderDetails.valueCancelReasonOther')}</Select.Item>
										</Select>
										<View className='mt-4 flex justify-between'>
											<View
												className='cursor-pointer'
												onClick={() => setCancelConfirmation(false)}>
												<Text className='text-sm font-bold text-gray-700 hover:underline'>
													{t('orderDetails.lbBack')}
												</Text>
											</View>
											<View
												className={`cursor-pointer ${!cancelReason && 'opacity-50 cursor-not-allowed'}`}
												onClick={cancelOrder}>
												<Text
													className={`text-sm font-bold ${
														cancelReason ? 'text-red-600 hover:underline' : 'text-gray-400'
													}`}>
													{t('orderDetails.lbContinueCancel')}
												</Text>
											</View>
										</View>
									</View>
								) : (
									<View
										className='cursor-pointer'
										onClick={() => setCancelConfirmation(true)}>
										<Text className='font-bold text-red-600 hover:underline'>
											{t('orderDetails.lbCancel')}
										</Text>
									</View>
								)}
							</View>
						</GenericBox>
					)}
				</View>

				<BottomInset />
			</Page>
		</ProtectedView>
	)
}
