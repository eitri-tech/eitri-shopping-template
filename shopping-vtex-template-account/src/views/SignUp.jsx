import Eitri from 'eitri-bifrost'
import { useTranslation } from 'eitri-i18n'
import {
	CustomButton,
	CustomInput,
	HeaderText,
	HeaderContentWrapper,
	HeaderReturn,
	Loading
} from 'shopping-vtex-template-shared'
import Alert from '../components/Alert/Alert'
import CCheckbox from '../components/CCheckbox/CCheckbox'
import { getSavedUser, loginWithEmailAndKey, sendAccessKeyByEmail } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { getStorePreferences } from '../services/StoreService'
import { sendScreenView } from '../services/TrackingService'
import userIcon from '../assets/icons/user.svg'
import { addonUserTappedActiveTabListener } from '../utils/backToTopListener'

export default function SignUp(props) {
	const [storeConfig, setStoreConfig] = useState(false)
	const [termsChecked, setTermsChecked] = useState(false)
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const [showLoginErrorAlert, setShowLoginErrorAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState('')
	const [verificationCode, setVerificationCode] = useState('')
	const [emailCodeSent, setEmailCodeSent] = useState(false)
	const [timeOutToResentEmail, setTimeOutToResentEmail] = useState(0)
	const [loadingSendingCode, setLoadingSendingCode] = useState(false)

	const TIME_TO_RESEND_EMAIL = 60
	const resendCode = timeOutToResentEmail > 0

	const { t } = useTranslation()

	useEffect(() => {
		getStorePreferences().then(conf => {
			setStoreConfig(conf)
		})
		const loadSavedUser = async () => {
			const user = await getSavedUser()

			if (user && user.email) {
				setEmail(user.email)
			}
		}

		loadSavedUser()
		addonUserTappedActiveTabListener()
		sendScreenView('Cadastro', 'SignUp')
	}, [])

	useEffect(() => {
		if (timeOutToResentEmail > 0) {
			setTimeout(() => {
				setTimeOutToResentEmail(prevState => prevState - 1)
			}, 1000)
		}
	}, [timeOutToResentEmail])

	const sendAccessKey = async () => {
		if (!termsChecked) {
			setAlertMessage(t('signUp.alertMessageAcceptTerms', 'Necessário aceitar os termos'))
			setShowLoginErrorAlert(true)

			return
		}

		try {
			if (timeOutToResentEmail > 0) return

			setLoadingSendingCode(true)
			await sendAccessKeyByEmail(email)
			setEmailCodeSent(true)
			setTimeOutToResentEmail(TIME_TO_RESEND_EMAIL)
		} catch (e) {
			setAlertMessage(t('signUp.alertMessageSendEmailError', 'Erro ao enviar email'))
			setShowLoginErrorAlert(true)
			setEmailCodeSent(false)
			setTimeOutToResentEmail(0)
		} finally {
			setLoadingSendingCode(false)
		}
	}

	const loginWithEmailAndAccessKey = async () => {
		setLoading(true)

		try {
			const loggedIn = await loginWithEmailAndKey(email, verificationCode)

			if (loggedIn === 'WrongCredentials') {
				setAlertMessage(t('signUp.alertMessageInvalidToken', 'Token incorreto'))
				setShowLoginErrorAlert(true)
			} else if (loggedIn === 'Success') {
				navigate(PAGES.HOME)
			} else {
				setAlertMessage(t('signUp.alertMessageVerify', 'Verifique as informaçoes e tente novamente'))
				setShowLoginErrorAlert(true)
			}
		} catch (e) {
			const status = e?.response?.status || 400

			if (status >= 500) {
				setAlertMessage(t('signUp.alertMessageServiceError', 'Ocorreu uma falha no serviço, tente novamente'))
			} else {
				setAlertMessage(t('signUp.alertMessageVerify', 'Verifique as informaçoes e tente novamente'))
			}

			setShowLoginErrorAlert(true)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Page topInset>
			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('signUp.lbRegister', 'Registrar')} />
			</HeaderContentWrapper>

			<View className='p-4'>
				<Text className='text-xl font-bold'>{t('signUp.lbEmailAccess', 'Acessar com o seu email')}</Text>

				{/* Container do formulário com espaçamento vertical consistente */}
				<View className='mt-8 flex flex-col gap-y-4'>
					<CustomInput
						icon={userIcon}
						value={email}
						type='email'
						placeholder={t('signUp.emailPlaceholder', 'Email')}
						onChange={e => setEmail(e.target.value)}
						showClearInput={false}
						required={true}
					/>

					<CCheckbox
						label={`${t('signUp.textTerms', 'Ao clicar em Registrar você concorda com os termos de serviço')}${storeConfig?.displayCompanyName ? ' ' + storeConfig?.displayCompanyName : ''}.`}
						checked={termsChecked}
						onChange={setTermsChecked}
					/>

					{emailCodeSent && (
						<>
							<CustomInput
								label={t('signUp.lbVerifyCode', 'Código de verificação')}
								placeholder={t('signUp.lbVerifyCode', 'Código de verificação')}
								inputMode='numeric'
								value={verificationCode}
								onChange={e => setVerificationCode(e.target.value)}
								height='45px'
							/>

							<CustomButton
								label={t('signUp.lbLogin', 'Login')}
								onPress={loginWithEmailAndAccessKey}
								disabled={!email || !verificationCode}
								type='email'
							/>
						</>
					)}

					<CustomButton
						width='100%'
						label={
							!emailCodeSent
								? t('signIn.textSendCode', 'Enviar código')
								: `${t('signIn.textResendCode', 'Reenviar código')}${resendCode ? ` (${timeOutToResentEmail})` : ''}`
						}
						disabled={resendCode || !email || loadingSendingCode}
						onPress={sendAccessKey}
					/>

					<CustomButton
						variant='outlined'
						label={t('signUp.lbBack', 'Voltar')}
						onPress={() => Eitri.navigation.back()}
					/>
				</View>
			</View>

			<Alert
				type='negative'
				show={showLoginErrorAlert}
				onDismiss={() => setShowLoginErrorAlert(false)}
				duration={7}
				message={alertMessage}
			/>
		</Page>
	)
}
