import Eitri from 'eitri-bifrost'
import { CustomButton, CustomInput, Loading } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { View, Text, Radio } from 'eitri-luminus'

export default function Freight(props) {
	const { cart, changeCartAddress, updateCartFreight } = useLocalShoppingCart()

	const [zipCode, setZipCode] = useState('')
	const [shipping, setShipping] = useState(null)
	const [isUnavailable, setIsUnavailable] = useState(false)
	const [messagesError, setMessagesError] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedOption, setSelectedOption] = useState('')
	const [error, setError] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		const shipping = cart?.shipping

		if (shipping) {
			const { address, postalCode } = shipping
			const { geoCoordinates } = address

			if (geoCoordinates.length === 0 && cart?.canEditData) {
				setError(t('freight.errorCep'))
				setZipCode(postalCode)
			} else {
				setShipping(shipping)
				setZipCode(postalCode)
				setError('')
				if (shipping?.shippingUnavailable) {
					setIsUnavailable(shipping.shippingUnavailable)
					setMessagesError(cart?.messages)
				}
			}
		} else {
			getZipCodeOnStorage()
		}
	}, [cart])

	const getZipCodeOnStorage = async () => {
		let postalCode = await Eitri.sharedStorage.getItem('zipCode')
		setZipCode(postalCode || '')
	}

	const setZipCodeOnStorage = async zipCode => {
		await Eitri.sharedStorage.setItem('zipCode', zipCode)
	}

	const onInputZipCode = value => {
		setZipCode(value)
	}

	const fetchFreight = async () => {
		setIsLoading(true)
		try {
			if (!zipCode) {
				return
			}
			if (!(zipCode.length == 8 || zipCode.length == 9)) {
				setError(t('freight.errorCep'))
				return
			}
			setError('')
			setZipCodeOnStorage(zipCode)
			await changeCartAddress(cart, zipCode)
			setIsLoading(false)
		} catch (error) {
			console.error('Error fetching freight [1]', error)
			setError(t('freight.errorCalcFreight'))
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
						maxLength={9}
						mask='99999-999'
						inputMode='numeric'
					/>
					<CustomButton
						variant='outlined'
						onPress={fetchFreight}
						isLoading={isLoading}
						label={t('freight.txtCalculate')}
						width='40%'
					/>
				</View>
			) : (
				<View className='mt-2'>
					<Text className='text-base font-medium'>{`[b]${t('freight.labelZipCode')}[/b]: ${shipping?.address?.postalCode}`}</Text>
				</View>
			)}

			{error && (
				<View
					className='mt-2'
					paddingBottom='small'>
					<Text className='text-xs text-tertiary-700'>{error}</Text>
				</View>
			)}
			{shipping && (
				<View className='flex flex-col my-2 py-2 border border-neutral-300 rounded-sm items-center justify-between'>
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
											<View className='w-1/4 p-2'>
												<Radio
													name='shippingOptions'
													value={item?.slas[0]?.id}
													checked={item?.slas[0]?.selected}
													onChange={() => onSetCartFreight(item)}
												/>
											</View>
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
