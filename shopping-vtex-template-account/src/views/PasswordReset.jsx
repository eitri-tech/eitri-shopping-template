import {
	Loading,
	HeaderContentWrapper,
	HeaderText,
	CustomButton,
	CustomInput,
	HeaderReturn
} from 'shopping-vtex-template-shared'
import Alert from '../components/Alert/Alert'
import { sendPasswordResetCode } from '../services/CustomerService'
import { sendScreenView } from '../services/TrackingService'
import { navigate, PAGES } from '../services/NavigationService'
import { useTranslation } from 'eitri-i18n'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function PasswordReset(props) {
	const { t } = useTranslation()

	const [username, setUsername] = useState('')
	const [loading, setLoading] = useState(false)
	const [showErrorAlert, setShowErrorAlert] = useState(false)

	useEffect(() => {
		const email = props?.location?.state?.email
		if (email) {
			setUsername(email)
		}

		addonUserTappedActiveTabListener()
		sendScreenView('Reset de senha - início', 'PasswordReset')
	}, [])

	const goToPasswordResetCode = async () => {
		try {
			if (!username) {
				return
			}
			setLoading(true)
			await sendPasswordResetCode(username)
			navigate(PAGES.PASSWORD_RESET_CODE, { email: username })
			setLoading(false)
		} catch (e) {
			setShowErrorAlert(true)
			setLoading(false)
		}
	}

	return (
		<Page topInset>
			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<HeaderContentWrapper className=''>
				<HeaderReturn />
				<HeaderText text={t('passwordReset.headerText')} />
			</HeaderContentWrapper>

			<View className='p-4 flex flex-col h-full'>
				<View>
					<View className='flex flex flex-col gap-2 mb-4'>
						<Text className='w-full font-bold text-xl'>{t('passwordReset.emailRecoveryTitle')}</Text>
						<Text className='text-sm text-gray-600'>{t('passwordReset.messageRecovery')}</Text>
					</View>

					<CustomInput
						inputMode='email'
						placeholder={t('passwordReset.setEmail')}
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
				</View>

				<View className='mt-4'>
					<CustomButton
						label={t('passwordReset.sendButton')}
						onPress={goToPasswordResetCode}
						disabled={!username || loading}
					/>
				</View>
			</View>

			<Alert
				type='negative'
				show={showErrorAlert}
				onDismiss={() => setShowErrorAlert(false)}
				duration={7}
				message={t('passwordReset.messageError')}
			/>
		</Page>
	)
}
