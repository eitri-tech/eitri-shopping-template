import Eitri from 'eitri-bifrost'
import { useState, useEffect } from 'react'
import { CustomButton } from 'shopping-vtex-template-shared'
import OrderStatusBadge from '../OrderStatusBadge/OrderStatusBadge'
import { formatDateDaysMonthYear, formatPriceInCents } from '../../utils/utils'
import { getOrderById } from '../../services/CustomerService'
import ImageCard from '../Image/ImageCard'
import { navigate, PAGES } from '../../services/NavigationService'

export default function OrderCard(props) {
	const { order, showOrderDetails } = props

	const [loadingDetails, setLoadingDetails] = useState(false)
	const [orderDetail, setOrderDetails] = useState(null)

	useEffect(() => {
		if (showOrderDetails) {
			loadDetails()
		}
	}, [order, showOrderDetails])

	const loadDetails = async () => {
		setLoadingDetails(true)
		try {
			const result = await getOrderById(order?.orderId)
			setOrderDetails(result)
		} catch (e) {
			console.error('Falha ao carregar detalhes do pedido:', e)
		} finally {
			setLoadingDetails(false)
		}
	}

	const openOrderDetails = () => {
		if (orderDetail) {
			navigate(PAGES.ORDER_DETAILS, { order: orderDetail })
		} else {
			navigate(PAGES.ORDER_DETAILS, { order: order.orderId })
		}
	}

	return (
		<View className='flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 w-full mb-4'>
			<View className='p-4 grid grid-cols-2 gap-x-4 gap-y-4'>
				<View className='flex flex flex-col'>
					<Text className='text-xs font-semibold uppercase text-gray-500'>Pedido</Text>
					<Text className='text-sm font-medium text-gray-900 truncate'>{order?.orderId}</Text>
				</View>

				<View className='flex justify-end items-start'>
					<OrderStatusBadge
						statusId={order?.status}
						statusDescription={order?.statusDescription}
					/>
				</View>

				<View className='flex flex flex-col'>
					<Text className='text-xs font-semibold uppercase text-gray-500'>Data</Text>
					<Text className='text-sm text-gray-700'>{formatDateDaysMonthYear(order?.creationDate)}</Text>
				</View>

				<View className='flex flex flex-col text-right'>
					<Text className='text-xs font-semibold uppercase text-gray-500'>
						Total ({`${order?.totalItems} ${order?.totalItems > 1 ? 'itens' : 'item'}`})
					</Text>
					<Text className='text-sm font-bold text-gray-900'>{formatPriceInCents(order?.totalValue)}</Text>
				</View>
			</View>

			{/* Seção 4: Lista de Produtos (condicional) */}
			{showOrderDetails && (
				<View className='p-4 border-t border-gray-200'>
					{loadingDetails ? (
						<View className='flex justify-center items-center py-2'>
							<Text className='text-sm text-gray-500'>Carregando produtos...</Text>
						</View>
					) : (
						orderDetail && (
							<View className='flex flex-col gap-y-4'>
								{orderDetail?.items?.map(item => (
									<View
										key={item.uniqueId}
										className='flex items-center gap-x-3'>
										<ImageCard
											imageUrl={item.imageUrl}
											className='w-16 h-16 rounded-md object-cover'
										/>
										<View className='flex flex-1 flex-col justify-center'>
											<Text className='text-sm text-gray-800 font-medium line-clamp-2 mb-1'>
												{item.name}
											</Text>
											<Text className='text-xs text-gray-600'>
												{`${item.quantity} un • ${formatPriceInCents(item.price)}`}
											</Text>
										</View>
									</View>
								))}
							</View>
						)
					)}
				</View>
			)}

			<View className='p-4 border-t border-gray-200'>
				<CustomButton
					width='100%'
					label={'Ver detalhes do pedido'}
					onPress={openOrderDetails}
				/>
			</View>
		</View>
	)
}
