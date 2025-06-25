import lockIcon from '../assets/icons/lock.svg'
import BigTitle from '../components/BigTitle/BigTitle'
import { Loading, HeaderTemplate, HEADER_TYPE, CustomButton, CustomInput } from 'shopping-vtex-template-shared'
import Alert from '../components/Alert/Alert'
import { navigate, PAGES } from '../services/NavigationService'
import { useTranslation } from 'eitri-i18n'
import { setPassword } from '../services/CustomerService'

export default function PasswordResetNewPass(props) {
	const email = props?.location?.state?.email
	const recoveryCode = props?.location?.state?.recoveryCode

	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [showErrorAlert, setShowErrorAlert] = useState(false)

	const { t } = useTranslation()

	const requirements = [
		{
			text: t('passwordResetNewPass.passwordRequirementsCharacters'),
			valid: newPassword.length >= 8
		},
		{
			text: t('passwordResetNewPass.passwordRequirementsNumber'),
			valid: /[0-9]/.test(newPassword)
		},
		{
			text: t('passwordResetNewPass.passwordRequirementsUppercase'),
			valid: /[A-Z]/.test(newPassword)
		},
		{
			text: t('passwordResetNewPass.passwordRequirementsLowercase'),
			valid: /[a-z]/.test(newPassword)
		}
	]

	const confirmNewPassword = async () => {
		try {
			if (!email || !recoveryCode || !newPassword) {
				return
			}
			setLoading(true)
			await setPassword(email, recoveryCode, newPassword)
			navigate('Home')
			setLoading(false)
		} catch (e) {
			logError(PAGE, 'Erro ao redefinir senha', e)
			setShowErrorAlert(true)
			setLoading(false)
		}
	}

	const allRequirementsMet = requirements.every(req => req.valid)
	const passwordsMatch = newPassword === confirmPassword

	return (
		<Page topInset>
			<Loading
				isLoading={loading}
				fullScreen={true}
			/>

			<HeaderTemplate
				headerType={HEADER_TYPE.TEXT}
				contentText={`${t('passwordResetNewPass.headerText')}`}
			/>

			<View padding='large'>
				<BigTitle
					title={t('passwordResetNewPass.forgotPass')}
					withBackAction
				/>

				<View marginTop='large'>
					<CustomInput
						autoFocus
						icon={lockIcon}
						type='password'
						placeholder={t('passwordResetNewPass.newPass')}
						value={newPassword}
						onChange={setNewPassword}
					/>
				</View>

				<View marginTop='large'>
					<CustomInput
						icon={lockIcon}
						type='password'
						placeholder={t('passwordResetNewPass.confirmPass')}
						value={confirmPassword}
						onChange={setConfirmPassword}
					/>
				</View>

				<View marginTop='large'>
					<Text fontWeight='bold'>{t('passwordResetNewPass.passwordRequirements')}</Text>
					<View marginTop='quark'>
						{requirements.map((req, index) => (
							<View
								key={req.text}
								display='flex'
								alignItems='center'
								gap={6}>
								{/*<Icon*/}
								{/*	color={req.valid ? 'positive-700' : 'negative-700'}*/}
								{/*	width={16}*/}
								{/*	height={16}*/}
								{/*	iconKey={req.valid ? 'check' : 'x'}*/}
								{/*/>*/}
								<Text
									key={index}
									color={req.valid ? 'positive-700' : 'negative-700'}>
									{req.text}
								</Text>
							</View>
						))}
					</View>
				</View>

				<View marginTop='large'>
					<CustomButton
						width='100%'
						disabled={!allRequirementsMet || !passwordsMatch}
						label={t('passwordResetNewPass.sendButton')}
						onPress={confirmNewPassword}
					/>
				</View>
			</View>

			<Alert
				type='negative'
				show={showErrorAlert}
				onDismiss={() => setShowErrorAlert(false)}
				duration={7}
				message={t('passwordResetNewPass.messageError')}
			/>
		</Page>
	)
}
