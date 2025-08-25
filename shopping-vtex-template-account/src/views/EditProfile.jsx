import { getCustomerData, setCustomerData } from '../services/CustomerService'
import { sendScreenView } from '../services/TrackingService'
import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	CustomInput,
	HeaderText,
	HeaderContentWrapper,
	Loading,
	HeaderReturn,
	BottomInset
} from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
import formatDateMMDDYYYY, { formatDate } from '../utils/utils'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function EditProfile(props) {
	const [user, setUser] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const [showNotification, setShowNotification] = useState(false)

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

		// Limpar erro do campo quando o usuário começar a digitar
		if (errors[target]) {
			setErrors({
				...errors,
				[target]: null
			})
		}
	}

	const validateFields = () => {
		const newErrors = {}

		// Validar nome
		if (!user.firstName || user.firstName.trim() === '') {
			newErrors.firstName = 'Nome é obrigatório'
		}

		// Validar sobrenome
		if (!user.lastName || user.lastName.trim() === '') {
			newErrors.lastName = 'Sobrenome é obrigatório'
		}

		// Validar data de nascimento
		if (!user.birthDate || user.birthDate.trim() === '') {
			newErrors.birthDate = 'Data de nascimento é obrigatória'
		} else {
			const { isValid } = convertToISO(user.birthDate)
			if (!isValid) {
				newErrors.birthDate = 'Data de nascimento inválida ou menor de 18 anos'
			}
		}

		// Validar telefone
		if (!user.homePhone || user.homePhone.trim() === '') {
			newErrors.homePhone = 'Telefone é obrigatório'
		}

		// Validar gênero
		if (!user.gender) {
			newErrors.gender = 'Gênero é obrigatório'
		}

		// Validar CPF
		if (!user.document || user.document.trim() === '') {
			newErrors.document = 'CPF é obrigatório'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSave = async () => {
		try {
			// Validar campos antes de salvar
			if (!validateFields()) {
				return
			}

			setIsLoading(true)
			const { isValid, isoDate } = convertToISO(user.birthDate)
			if (!isValid) {
				setIsLoading(false)
				return
			}
			const updatedUser = await setCustomerData({ ...user, birthDate: isoDate })
			setUser({ ...updatedUser, birthDate: formatDate(updatedUser?.birthDate) })
			setIsLoading(false)
			setShowNotification(true)
			setTimeout(() => {
				setShowNotification(false)
			}, 3000)
		} catch (e) {
			setIsLoading(false)
		}
	}

	const loadMe = async () => {
		setIsLoading(true)
		const customerData = await getCustomerData()
		setUser({ ...customerData, birthDate: customerData?.birthDate ? formatDate(customerData?.birthDate) : '' })
		setIsLoading(false)
	}

	function convertToISO(dateStr) {
		const dt = dateStr?.replaceAll('/', '')
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

	// Verificar se todos os campos obrigatórios estão preenchidos
	const isFormValid = () => {
		return (
			user.firstName &&
			user.firstName.trim() !== '' &&
			user.lastName &&
			user.lastName.trim() !== '' &&
			user.birthDate &&
			user.birthDate.trim() !== '' &&
			user.homePhone &&
			user.homePhone.trim() !== '' &&
			user.gender &&
			user.document &&
			user.document.trim() !== ''
		)
	}

	return (
		<Page
			title={'Editar perfil'}
			statusBarTextColor='white'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('editProfile.title')} />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			<View className='p-4 flex flex-col gap-4'>
				<View>
					<Text className='w-full font-bold text-xs'>{t('editProfile.lbName')} *</Text>
					<View className='mt-1 flex gap-1.5'>
						<CustomInput
							backgroundColor='background-color'
							placeholder={t('editProfile.lbName')}
							value={user?.firstName || ''}
							onChange={value => handleInputChange('firstName', value)}
							error={errors.firstName}
						/>
						{errors.firstName && <Text className='text-red-500 text-xs mt-1'>{errors.firstName}</Text>}
						<CustomInput
							backgroundColor='background-color'
							placeholder={t('editProfile.lbLastName')}
							value={user?.lastName || ''}
							onChange={value => handleInputChange('lastName', value)}
							error={errors.lastName}
						/>
						{errors.lastName && <Text className='text-red-500 text-xs mt-1'>{errors.lastName}</Text>}
					</View>
				</View>

				<View>
					<Text className='w-full mb-1 font-bold text-xs'>{t('editProfile.lbBirthdate')} *</Text>
					<CustomInput
						backgroundColor='background-color'
						placeholder='DD/MM/AAAA'
						variant='mask'
						mask='99/99/9999'
						inputMode='numeric'
						value={user?.birthDate || ''}
						onChange={value => handleInputChange('birthDate', value)}
						error={errors.birthDate}
					/>
					{errors.birthDate && <Text className='text-red-500 text-xs mt-1'>{errors.birthDate}</Text>}
				</View>

				<View>
					<Text className='w-full mb-1 font-bold text-xs'>{t('editProfile.lbPhone')} *</Text>
					<CustomInput
						backgroundColor='background-color'
						placeholder='(99) 99999-9999'
						value={user?.homePhone?.replace('+55', '') || ''}
						inputMode='numeric'
						variant='mask'
						onChange={value => handleInputChange('homePhone', value)}
						mask='(99) 99999-9999'
						error={errors.homePhone}
					/>
					{errors.homePhone && <Text className='text-red-500 text-xs mt-1'>{errors.homePhone}</Text>}
				</View>

				<View>
					<Text className='w-full mb-1 font-bold text-xs'>{t('editProfile.lbGender')} *</Text>
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
					{errors.gender && <Text className='text-red-500 text-xs mt-1'>{errors.gender}</Text>}
				</View>

				<View>
					<Text className='w-full mb-1 font-bold text-xs'>{t('editProfile.lbCPF')} *</Text>
					<CustomInput
						backgroundColor='background-color'
						placeholder='000.000.000-00'
						value={user.document || ''}
						inputMode='numeric'
						variant='mask'
						onChange={value => handleInputChange('document', value)}
						mask='999.999.999-99'
						error={errors.document}
					/>
					{errors.document && <Text className='text-red-500 text-xs mt-1'>{errors.document}</Text>}
				</View>

				{showNotification && (
					<View className='bg-green-500 text-white px-4 py-3 rounded shadow-lg flex flex-row items-center justify-between'>
						<View className='flex flex-row items-center gap-2'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
								className='text-white'>
								<path d='M20 6L9 17l-5-5'></path>
							</svg>
							<Text className='text-white font-medium'>Salvo com sucesso!</Text>
						</View>
					</View>
				)}
			</View>

			{/* Botão fixo na parte inferior */}
			<View className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300'>
				<View className='p-4'>
					<CustomButton
						width='100%'
						label={t('editProfile.lbSave')}
						onPress={handleSave}
						disabled={!isFormValid() || isLoading}
					/>
				</View>
				<BottomInset />
			</View>

			<BottomInset offSet={77} />
		</Page>
	)
}
