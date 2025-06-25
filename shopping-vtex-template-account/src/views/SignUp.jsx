import Eitri from 'eitri-bifrost'
import { CustomButton, CustomInput, HEADER_TYPE, HeaderTemplate, Loading } from 'shopping-vtex-template-shared'
import userIcon from '../assets/icons/user.svg'
import CCheckbox from '../components/CCheckbox/CCheckbox'
import { sendPageView } from '../services/TrackingService'
import { getStorePreferences } from '../services/StoreService'
import { getSavedUser, loginWithEmailAndKey, sendAccessKeyByEmail } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { useTranslation } from 'eitri-i18n'
import PoweredBy from '../components/PoweredBy/PoweredBy'

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

	const sendAccessKey = async () => {
		if (termsChecked) {
			try {
				if (timeOutToResentEmail > 0) {
					return
				}
				setLoadingSendingCode(true)
				await sendAccessKeyByEmail(email)
				setEmailCodeSent(true)
				setTimeOutToResentEmail(TIME_TO_RESEND_EMAIL)
				setLoadingSendingCode(false)
			} catch (e) {
				console.log('erro ao enviar email', e)
				setAlertMessage(t('signUp.alertMessageSendEmailError'))
				setShowLoginErrorAlert(true)
				setEmailCodeSent(false)
				setTimeOutToResentEmail(0)
				setLoadingSendingCode(false)
			}
		} else {
			setAlertMessage(t('signUp.alertMessageAcceptTerms'))
			setShowLoginErrorAlert(true)
		}
		e
	}

	const loginWithEmailAndAccessKey = async () => {
		const loggedIn = await loginWithEmailAndKey(email, verificationCode).catch(e => {
			const status = e?.response?.status || 400
			if (status >= 500) return 'ServerError'
			return 'ExpiredCredentials'
		})

		if (loggedIn === 'WrongCredentials') {
			setAlertMessage(t('signUp.alertMessageInvalidToken'))
			setShowLoginErrorAlert(true)
		} else if (loggedIn === 'ServerError') {
			setAlertMessage(t('signUp.alertMessageServiceError'))
			setShowLoginErrorAlert(true)
		} else if (loggedIn === 'Success') {
			navigate(PAGES.HOME)
		} else {
			setAlertMessage(t('signUp.alertMessageVerify'))
			setShowLoginErrorAlert(true)
		}
	}

	const back = () => {
		Eitri.navigation.back()
	}

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
		sendPageView('SignUp')
	}, [])

	useEffect(() => {
		if (timeOutToResentEmail > 0) {
			setTimeout(() => {
				setTimeOutToResentEmail(prevState => prevState - 1)
			}, 1000)
		}
	}, [timeOutToResentEmail])

	return (
		<Page topInset>
			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<HeaderTemplate
				headerType={HEADER_TYPE.TEXT}
				contentText={t('signUp.lbRegister')}
			/>

			<View padding='large'>
				<Text
					block
					fontWeight='bold'
					fontSize='huge'>
					{t('signUp.lbEmailAccess')}
				</Text>

				<View marginTop='display'>
					<CustomInput
						icon={userIcon}
						value={email}
						type='email'
						placeholder='Email'
						onChange={value => {
							setEmail(value)
						}}
						showClearInput={false}
						required={true}
					/>

					<View marginTop='large'>
						<CCheckbox
							label={`${t('signUp.textTerms')}${storeConfig?.displayCompanyName ? ' ' + storeConfig?.displayCompanyName : ''}.`}
							checked={termsChecked}
							onChange={setTermsChecked}
						/>
					</View>

					{emailCodeSent && (
						<>
							<View marginTop='large'>
								<CustomInput
									label={t('signUp.lbVerifyCode')}
									placeholder={t('signUp.lbVerifyCode')}
									inputMode='numeric'
									value={verificationCode}
									onChange={text => setVerificationCode(text)}
									height='45px'
								/>
							</View>

							<View marginTop='large'>
								<CustomButton
									label={t('signUp.lbLogin')}
									onPress={loginWithEmailAndAccessKey}
									disabled={!email || !verificationCode}
									type='email'
								/>
							</View>
						</>
					)}

					<View marginTop='large'>
						<CustomButton
							width='100%'
							label={
								!emailCodeSent
									? t('signIn.textSendCode')
									: `${t('signIn.textResendCode')}${resendCode ? ` (${timeOutToResentEmail})` : ''}`
							}
							disabled={resendCode || !email || loadingSendingCode}
							onPress={sendAccessKey}
						/>
					</View>

					<View marginTop='large'>
						<CustomButton
							variant='outlined'
							label={t('signUp.lbBack')}
							onPress={back}
						/>
					</View>
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
