import { getCustomerData, setCustomerData } from '../services/CustomerService'
import { sendScreenView } from '../services/TrackingService'
import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	CustomInput,
	HeaderText,
	HeaderContentWrapper,
	Loading,
	HeaderReturn
} from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
import formatDateMMDDYYYY from '../utils/utils'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function EditProfile(props) {
	const [user, setUser] = useState({})

	const [isLoading, setIsLoading] = useState(false)

	const { t } = useTranslation()

	useEffect(() => {
		const customerData = props?.location?.state?.customerData

		if (!customerData) {
			loadMe()
		} else {
			setUser({
				...user,
				...customerData,
				birthDate: formatDateMMDDYYYY(customerData?.birthDate)
			})
		}

		sendScreenView('Editar Perfil', 'EditProfile')
		addonUserTappedActiveTabListener()
	}, [])

	const handleInputChange = (target, e) => {
		const value = e.target.value
		setUser({
			...user,
			[target]: value
		})
	}

	const handleSave = async () => {
		setIsLoading(true)
		const { isValid, isoDate } = convertToISO(user.birthDate)
		if (!isValid) {
			setIsLoading(false)
			return
		}
		const updatedUser = await setCustomerData({ ...user, birthDate: isoDate })
		setUser({ ...updatedUser, birthDate: formatDate(updatedUser?.birthDate) })
		setIsLoading(false)
	}

	const loadMe = async () => {
		setIsLoading(true)
		const customerData = await getCustomerData()
		setUser({ ...customerData, birthDate: formatDate(customerData?.birthDate) })
		setIsLoading(false)
	}

	function convertToISO(dateStr) {
		const dt = dateStr.replaceAll('/', '')
		const day = parseInt(dt.substring(0, 2), 10)
		const month = parseInt(dt.substring(2, 4), 10)
		const year = parseInt(dt.substring(4, 8), 10)

		const date = new Date(year, month - 1, day)

		// Valid date
		let isValid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day

		if (!isValid) {
			return { isValid }
		}

		// More than 18 years
		const today = new Date()

		isValid =
			today.getFullYear() - year > 18 ||
			(today.getFullYear() - year === 18 && today.getMonth() > month) ||
			(today.getFullYear() - year === 18 && today.getMonth() === month && today.getDate() >= day)

		if (!isValid) {
			return { isValid }
		}

		return { isValid, isoDate: date.toISOString() }
	}

	const openWhatsApp = async () => {
		try {
			await Eitri.openBrowser({ url: 'https://api.whatsapp.com/send?phone=+5511959612798' })
		} catch (e) {
			console.error('Error mailToSac', e)
		}
	}

	return (
		<Page title={'Editar perfil'}>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('editProfile.title')} />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			<View
				bottomInset={'auto'}
				className='p-4 flex flex-col gap-4'>
				<View>
					<Text className='w-full font-bold text-xs'>{t('editProfile.lbName')}</Text>
					<View className='mt-1 flex gap-1.5'>
						<CustomInput
							backgroundColor='background-color'
							placeholder={t('editProfile.lbName')}
							value={user?.firstName || ''}
							onChange={value => handleInputChange('firstName', value)}
						/>
						<CustomInput
							backgroundColor='background-color'
							placeholder={t('editProfile.lbLastName')}
							value={user?.lastName || ''}
							onChange={value => handleInputChange('lastName', value)}
						/>
					</View>
				</View>

				<View>
					<Text className='w-full mb-1 font-bold text-xs'>{t('editProfile.lbBirthdate')}</Text>
					<CustomInput
						backgroundColor='background-color'
						placeholder='DD/MM/AAAA'
						variant='mask'
						mask='99/99/9999'
						inputMode='numeric'
						value={user?.birthDate || ''}
						onChange={value => handleInputChange('birthDate', value)}
					/>
				</View>

				<View>
					<Text className='w-full mb-1 font-bold text-xs'>{t('editProfile.lbPhone')}</Text>
					<CustomInput
						backgroundColor='background-color'
						placeholder='(99) 99999-9999'
						value={user?.homePhone?.replace('+55', '') || ''}
						inputMode='numeric'
						variant='mask'
						onChange={value => handleInputChange('homePhone', value)}
						mask='(99) 99999-9999'
					/>
				</View>

				<View>
					<Text className='w-full mb-1 font-bold text-xs'>{t('editProfile.lbGender')}</Text>
					<View className='flex gap-4'>
						<View
							className='flex flex-row items-center gap-1'
							sendFocusToInput>
							<Radio
								value={'male'}
								checked={user?.gender === 'male'}
								onChange={value => handleInputChange('gender', value)}
							/>
							<Text className='w-full ml-1'>{t('editProfile.lbGenderMale')}</Text>
						</View>
						<View
							className='flex flex-row items-center gap-1'
							sendFocusToInput>
							<Radio
								value={'female'}
								checked={user?.gender === 'female'}
								onChange={value => handleInputChange('gender', value)}
							/>
							<Text className='w-full ml-1'>{t('editProfile.lbGenderFemale')}</Text>
						</View>
					</View>
				</View>

				<View>
					<Text className='w-full mb-1 font-bold text-xs'>{t('editProfile.lbCPF')}</Text>
					<CustomInput
						backgroundColor='background-color'
						placeholder='000.000.000-00'
						value={user.document || ''}
						inputMode='numeric'
						variant='mask'
						onChange={value => handleInputChange('document', value)}
						mask='999.999.999-99'
					/>
				</View>

				<View className='pb-4'>
					<CustomButton
						width='100%'
						label={t('editProfile.lbSave')}
						onPress={handleSave}
					/>
				</View>
			</View>
		</Page>
	)
}
