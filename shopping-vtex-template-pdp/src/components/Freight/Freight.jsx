import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import fetchFreight from '../../services/freightService'
import { CustomButton, CustomInput } from 'shopping-vtex-template-shared'
export default function Freight(props) {
	const { currentSku } = props
	const { t } = useTranslation()
	const [zipCode, setZipCode] = useState('')
	const [freightOptions, setFreightOptions] = useState(null)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		handleZipCode()
	}, [])

	const handleZipCode = async () => {
		const postalCodeStorage = await Eitri.sharedStorage.getItem('zipCode')
		if (postalCodeStorage) {
			setZipCode(postalCodeStorage)
			handleFreight(postalCodeStorage)
		}
	}

	const onInputZipCode = value => {
		console.log(value)
		// setZipCode(value)
	}

	const handleFreight = async zipCode => {
		if (loading) return
		setLoading(true)
		try {
			let freightOpt = await fetchFreight(zipCode, currentSku)
			setFreightOptions(freightOpt)
			setZipCodeOnStorage(zipCode)
		} catch (error) {
			console.error('Error handleFreight', error)
		}
		setLoading(false)
	}

	const setZipCodeOnStorage = async zipCode => {
		await Eitri.sharedStorage.setItem('zipCode', zipCode)
	}

	return (
		<View>
			<View className='flex items-center justify-between w-full'>
				<Text className='text-lg font-bold'>{t('freight.txtCalculate')}</Text>
			</View>
			<View>
				<Text>{t('freight.txtCalculateDeadline')}</Text>
				<View className='flex justify-between items-center w-full gap-2'>
					<View className='w-[70%]'>
						<CustomInput
							placeholder={t('freight.labelZipCode')}
							value={zipCode}
							maxLength={9}
							inputMode='numeric'
							onChange={onInputZipCode}
						/>
					</View>
					<View className='w-[30%]'>
						<CustomButton
							label='calcular'
							variant='outlined'
							onClick={() => handleFreight(zipCode)}
						/>
					</View>
				</View>
				{loading && <Skeleton className='w-full h-full' />}
				{
					!loading && freightOptions && freightOptions?.options?.length > 0 && (
						<View className='flex flex flex-col my-2 py-2 border border-neutral items-center justify-between'>
							{freightOptions?.options.map((item, index) => (
								<View
									key={index}
									className='flex flex flex-col items-center w-full'>
									<View className='flex items-center justify-between px-2 w-full'>
										<Text className='font-bold'>{item?.label}</Text>
										<Text>{item?.price}</Text>
									</View>
									<View className='flex items-center justify-between px-2 w-full'>
										<Text className='text-neutral-content'>{item?.shippingEstimate}</Text>
									</View>
									{item.isPickupInPoint && (
										<View className='flex items-center px-2 w-full'>
											<Text className='text-neutral-content'>{item.pickUpAddress}</Text>
										</View>
									)}
								</View>
							))}
						</View>
					)
					// TODO: verificar qual vai ser o link de redirecionamento
					// <Touchable onPress={() => console.log("Não sei meu frete clicado")}>
					//     <Text color='secondary-300' textDecoration='underline'>Não sei meu cep</Text>
					// </Touchable>
				}
			</View>
		</View>
	)
}
