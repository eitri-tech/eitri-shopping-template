import { useTranslation } from 'eitri-i18n'
import fetchFreight from '../../services/freightService'
import { CustomButton, CustomInput } from 'shopping-vtex-template-shared'
import { loadPostalCodeFromStorage, savePostalCodeOnStorage } from '../../services/customerService'

export default function Freight(props) {
	const { currentSku } = props
	const { t } = useTranslation()
	const [zipCode, setZipCode] = useState('')
	const [freightOptions, setFreightOptions] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		loadPostalCodeFromStorage()
			.then(postalCode => {
				if (postalCode) {
					setZipCode(postalCode)
					handleFreight(postalCode)
				}
			})
			.catch()
	}, [])

	const onInputZipCode = e => {
		const value = e.target.value
		setZipCode(value)
	}

	const handleFreight = async zipCode => {
		if (loading) return
		setLoading(true)
		try {
			let freightOpt = await fetchFreight(zipCode, currentSku)
			setFreightOptions(freightOpt)
			await savePostalCodeOnStorage(zipCode)
		} catch (error) {
			console.error('Error handleFreight', error)
		}
		setLoading(false)
	}

	return (
		<View className='flex flex-col bg-white rounded shadow-sm border border-gray-300 p-4 w-full'>
			<View className='flex items-center justify-between w-full'>
				<Text className='text-lg font-semibold'>{t('freight.txtCalculate')}</Text>
			</View>
			<View>
				<View className='flex justify-between items-center w-full gap-2 mt-2'>
					<View className='w-2/3'>
						<CustomInput
							placeholder={t('freight.labelZipCode')}
							value={zipCode}
							variant='mask'
							mask='99999-999'
							inputMode='numeric'
							onChange={onInputZipCode}
						/>
					</View>
					<View className='w-1/3'>
						<CustomButton
							label='calcular'
							variant='outlined'
							onClick={() => handleFreight(zipCode)}
						/>
					</View>
				</View>

				{loading && <View className={`mt-3 w-full h-[100px] bg-gray-200 rounded animate-pulse`} />}

				{!loading && freightOptions && freightOptions?.options?.length > 0 && (
					<View className='flex flex-col items-center justify-between gap-2 mt-3'>
						{freightOptions?.options?.map(item => (
							<View
								key={item?.label}
								className='flex flex flex-col items-center w-full'>
								<View className='flex items-center justify-between w-full'>
									<Text className='font-bold'>{item?.label}</Text>
									<Text>{item?.price}</Text>
								</View>
								<View className='flex items-center justify-between w-full'>
									<Text className='text-neutral-content'>{item?.shippingEstimate}</Text>
								</View>
								{item.isPickupInPoint && (
									<View className='flex items-center w-full'>
										<Text className='text-neutral-content'>{item.pickUpAddress}</Text>
									</View>
								)}
							</View>
						))}
					</View>
				)}
			</View>
		</View>
	)
}
