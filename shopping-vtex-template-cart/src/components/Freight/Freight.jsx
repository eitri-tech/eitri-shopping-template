import Eitri from 'eitri-bifrost'
import { CustomButton, CustomInput, Loading, cartShippingResolver } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { View, Text, Radio } from 'eitri-luminus'
import { simulateCart } from '../../services/freigthService'

export default function Freight(props) {
	const { cart, changeCartAddress } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [zipCode, setZipCode] = useState('')
	const [shipping, setShipping] = useState(null)
	const [isUnavailable, setIsUnavailable] = useState(false)
	const [messagesError, setMessagesError] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedOption, setSelectedOption] = useState('')
	const [error, setError] = useState(false)

	useEffect(() => {
		if (cart) {
			loadZipCode()
		}
	}, [cart])

	const loadZipCode = async () => {
		const zipCode = await getZipCodeOnStorage()
		if (!zipCode) {
			return
		}
		setZipCode(zipCode)
		fetchFreight(zipCode)
	}

	const getZipCodeOnStorage = async () => {
		return await Eitri.sharedStorage.getItem('zipCode')
	}

	const setZipCodeOnStorage = async zipCode => {
		await Eitri.sharedStorage.setItem('zipCode', zipCode)
	}

	const onInputZipCode = e => {
		setZipCode(e.target.value)
	}

	const handleZipCodeChange = async () => {
		if (!zipCode) {
			return
		}
		if (!(zipCode.length == 8 || zipCode.length == 9)) {
			setError(t('freight.errorCep'))
			return
		}
		fetchFreight(zipCode)
	}

	const fetchFreight = async zipCode => {
		setIsLoading(true)
		try {
			setError('')
			setZipCodeOnStorage(zipCode)

			const simulatedCart = await simulateCart(zipCode, cart)
			const shipping = cartShippingResolver({
				shippingData: {
					logisticsInfo: simulatedCart?.logisticsInfo
				}
			})

			if (!shipping.shippingAvailable) {
				setError('Entrega indisponível')
				return
			}

			setShipping(shipping)
		} catch (error) {
			console.error('Error fetching freight [1]', error)
			setError(t('freight.errorCalcFreight'))
		} finally {
			setIsLoading(false)
		}
	}

	const onSetCartFreight = async option => {
		if (selectedOption !== option.label) {
			setSelectedOption(option.label)
			await setCartFreight(option)
			setSlaOptionVisible(false)
		}
	}

	const setCartFreight = async option => {
		try {
			await updateCartFreight(cart, option)
		} catch (error) {
			console.error('setCartFreight Error', error)
			setError(t('freight.errorEditFreight'))
		}
	}

	const getMessageError = label => {
		const message = messagesError.find(item => item.code === 'cannotBeDelivered')
		return (
			<View className='w-full px-2'>
				<Text className='font-bold'>{label}</Text>
				{message && <Text className='text-xs text-tertiary-700'>{message.fields.skuName}</Text>}
			</View>
		)
	}

	if (!cart) return null

	return (
		<View className='p-4'>
			<Text className='text-base font-bold'>{t('freight.txtDelivery')}</Text>

			{cart?.canEditData ? (
				<View className='flex justify-between mt-2 gap-2 items-center'>
					<CustomInput
						width='60%'
						placeholder={t('freight.labelZipCode')}
						value={zipCode}
						onChange={onInputZipCode}
						variant='mask'
						mask='99999-999'
						inputMode='numeric'
					/>
					<CustomButton
						variant='outlined'
						isLoading={isLoading}
						label={t('freight.txtCalculate')}
						className='grow'
						onPress={handleZipCodeChange}
					/>
				</View>
			) : (
				<View className='mt-2'>
					<Text className='text-base font-medium'>{`[b]${t('freight.labelZipCode')}[/b]: ${
						shipping?.address?.postalCode
					}`}</Text>
				</View>
			)}

			{error && (
				<View className='mt-1'>
					<Text className='text-xs text-red-600'>{error}</Text>
				</View>
			)}

			{shipping && shipping?.options.length > 0 && (
				<View className='flex flex-col my-2 p-4 border border-neutral-300 rounded items-center justify-between gap-2'>
					{shipping?.options.map((item, index) => (
						<View
							key={index}
							className='flex flex-row items-center w-full'>
							{isUnavailable ? (
								getMessageError(item?.label)
							) : (
								<>
									{isLoading ? (
										<View className='w-full flex items-center justify-center'>
											<Loading />
										</View>
									) : (
										<>
											<View className='w-full flex flex-col'>
												<Text className='font-bold'>{item?.label}</Text>
												<Text className='text-xs text-neutral-500'>
													{item?.shippingEstimate}
												</Text>
												{item.isPickupInPoint && (
													<Text className='text-xs text-neutral-500'>
														{item?.pickUpAddress}
													</Text>
												)}
											</View>
											<View className='flex w-3/10 justify-end p-2'>
												<Text>{item?.price}</Text>
											</View>
										</>
									)}
								</>
							)}
						</View>
					))}
				</View>
			)}
		</View>
	)
}
