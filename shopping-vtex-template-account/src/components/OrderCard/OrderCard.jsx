import Eitri from 'eitri-bifrost'
import { useState, useEffect } from 'react'
import { GenericBox } from 'shopping-vtex-template-shared'
import { FiCopy } from 'react-icons/fi'
import OrderStatusBadge from '../OrderStatusBadge/OrderStatusBadge'
import { formatDateDaysMonthYear, formatPriceInCents } from '../../utils/utils'
import { getOrderById } from '../../services/CustomerService'
import ImageCard from '../Image/ImageCard'
import { navigate, PAGES } from '../../services/NavigationService'
import OrderBuyAgain from '../OrderBuyAgain/OrderBuyAgain'
import { useSnackBar } from '../../providers/SnackBar'
import { useTranslation } from 'eitri-i18n'

export default function OrderCard(props) {
	const { order } = props
	const { showSnackBar } = useSnackBar()
	const { t } = useTranslation()

	const [loadingDetails, setLoadingDetails] = useState(false)
	const [orderDetail, setOrderDetails] = useState(null)

	useEffect(() => {
		loadDetails()
	}, [order])

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

	const handleCopyOrderId = async () => {
		Eitri.clipboard.setText({ text: order?.orderId })
		showSnackBar('success', t('orderCard.copySuccess'))
	}

	const openOrderDetails = () => {
		if (orderDetail) {
			navigate(PAGES.ORDER_DETAILS, { order: orderDetail })
		} else {
			navigate(PAGES.ORDER_DETAILS, { order: order.orderId })
		}
	}

	return (
		<GenericBox className=''>
			<View className='grid grid-cols-2 gap-x-4 gap-y-4'>
				<View className='flex flex flex-col'>
					<Text className='text-xs font-semibold uppercase text-gray-500'>{t('orderCard.order')}</Text>
					<View className='flex flex-row items-center gap-2'>
						<Text className='text-sm font-medium text-gray-900'>{order?.orderId}</Text>
						<View onClick={handleCopyOrderId}>
							<FiCopy
								className='text-gray-900'
								size={16}
							/>
						</View>
					</View>
				</View>

				{orderDetail && (
					<View className='flex justify-end items-start'>
						<OrderStatusBadge
							order={orderDetail}
							statusId={order?.status}
							statusDescription={order?.statusDescription}
						/>
					</View>
				)}

				<View className='flex flex flex-col'>
					<Text className='text-xs font-semibold uppercase text-gray-500'>{t('orderCard.date')}</Text>
					<Text className='text-sm text-gray-700'>{formatDateDaysMonthYear(order?.creationDate)}</Text>
				</View>

				<View className='flex flex flex-col text-right'>
					<Text className='text-xs font-semibold uppercase text-gray-500'>
						{t(order?.totalItems > 1 ? 'orderCard.totalPlural' : 'orderCard.totalSingular', { count: order?.totalItems })}
					</Text>
					<Text className='text-sm font-bold text-gray-900'>{formatPriceInCents(order?.totalValue)}</Text>
				</View>
			</View>

			<View className='py-4 mt-4 border-t border-gray-200'>
				{loadingDetails ? (
					<View className='flex justify-center items-center py-2'>
						<Text className='text-sm text-gray-500'>{t('orderCard.loading')}</Text>
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

			{orderDetail && (
				<View className='flex flex-col gap-4'>
					<OrderBuyAgain order={orderDetail} />
					<View
						className={'w-full flex justify-center'}
						onClick={openOrderDetails}>
						<Text className={'font-bold text-primary'}>{t('orderCard.details')}</Text>
					</View>
				</View>
			)}
		</GenericBox>
	)
}
