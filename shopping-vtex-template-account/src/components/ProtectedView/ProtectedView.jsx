import Eitri from 'eitri-bifrost'
import { isLoggedIn } from '../../services/CustomerService'
import { useTranslation } from 'eitri-i18n'

export default function ProtectedView(props) {
	const { afterLoginRedirectTo, redirectState, labelLoading } = props
	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function checkIfUserIsLogged() {
			setIsLoading(true)
			const logged = await isLoggedIn()

			if (!logged) {
				Eitri.navigation.navigate({
					path: 'SignIn',
					replace: true,
					state: { redirectTo: afterLoginRedirectTo, redirectState: redirectState }
				})
			}

			return setIsLoading(false)
		}

		checkIfUserIsLogged()
	}, [])

	if (isLoading) {
		return (
			<View
				display='flex'
				justifyContent='center'
				alignItems='center'
				minHeight='100vh'>
				<Text block>{labelLoading || t('protectedView.loading', 'Carregando...')}</Text>
			</View>
		)
	}

	return <>{props.children}</>
}
