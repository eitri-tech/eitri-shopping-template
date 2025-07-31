import Eitri from 'eitri-bifrost'
import { CustomButton, HeaderText, Loading, HeaderContentWrapper, BottomInset } from 'shopping-vtex-template-shared'
import { doLogout, getCustomerData, isLoggedIn } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { sendScreenView } from '../services/TrackingService'
import { useTranslation } from 'eitri-i18n'
import iconLogout from '../assets/icons/logout.svg'
import ProfileCardButton from '../components/ProfileCardButton/ProfileCardButton'
import { startConfigure } from '../services/AppService'
import PoweredBy from '../components/PoweredBy/PoweredBy'
import LoginCard from '../components/LoginCard/LoginCard'
import InfoCard from '../components/InfoCard/InfoCard'
import userIcon from '../assets/images/user.svg'
import bookmarkIcon from '../assets/images/bookmark-01.svg'
import boxIcon from '../assets/images/box-01.svg'

export default function Home(props) {
	const PAGE = 'Minha Conta'

	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(true)
	const [customerData, setCustomerData] = useState(props.customerData || {})
	const [isLogged, setIsLogged] = useState(null)

	useEffect(() => {
		init()
		sendScreenView('Perfil', 'Home')
	}, [])

	const init = async () => {
		await startConfigure()

		const startParams = await Eitri.getInitializationInfos()

		if (startParams?.action === 'RequestLogin') {
			navigate(PAGES.SIGNIN, { closeAppAfterLogin: true }, true)
			return
		}

		if (startParams) {
			const openRoute = processDeepLink(startParams)
			if (openRoute) {
				Eitri.navigation.navigate(openRoute)
				return
			}
		}

		const isLogged = await isLoggedIn()
		if (isLogged) {
			await loadMe()
		}

		setIsLogged(isLogged)
		setIsLoading(false)

		sendPageView(PAGE)
	}

	const loadMe = async () => {
		const customerData = await getCustomerData()
		setCustomerData(customerData)
	}

	const _doLogout = async () => {
		setIsLoading(true)
		await doLogout()
		init()
	}

	const processDeepLink = startParams => {
		if (startParams?.route) {
			let { route, ...rest } = startParams
			return {
				path: route,
				state: rest,
				replace: true
			}
		}
	}

	return (
		<Page title={PAGE}>
			<HeaderContentWrapper className='justify-between'>
				<HeaderText text={t('home.labelMyAccount')} />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			{!isLoading && (isLogged ? <InfoCard customerData={customerData} /> : <LoginCard />)}

			<View className='px-4 mt-2 mb-2'>
				<Text className='font-bold text-xl mb-3 text-gray-900'>{t('home.lbPersonalData')}</Text>

				<View className='flex flex-col gap-3 mt-2'>
					<ProfileCardButton
						label={t('home.labelMyAccount')}
						icon={userIcon}
						onClick={() => {
							isLogged
								? navigate(PAGES.EDIT_PROFILE, { customerData })
								: navigate(PAGES.SIGNIN, { redirectTo: PAGES.EDIT_PROFILE })
						}}
					/>
					<ProfileCardButton
						label={t('home.labelMyFavorites')}
						icon={bookmarkIcon}
						onClick={() => {
							isLogged
								? navigate(PAGES.WISH_LIST)
								: navigate(PAGES.SIGNIN, { redirectTo: PAGES.WISH_LIST })
						}}
					/>
				</View>
			</View>

			<View className='px-4 mt-6 mb-2'>
				<Text className='font-bold text-xl mb-3 text-gray-900'>{t('home.lbOrders')}</Text>
				<View className='flex flex-col gap-3 mt-2'>
					<ProfileCardButton
						label={t('home.labelMyOrders')}
						icon={boxIcon}
						onClick={() => {
							isLogged
								? navigate(PAGES.ORDER_LIST)
								: navigate(PAGES.SIGNIN, { redirectTo: PAGES.ORDER_LIST })
						}}
					/>
				</View>
			</View>

			{isLogged && (
				<View className='px-4 py-6 mt-4'>
					<CustomButton
						variant='outlined'
						label={t('home.labelLeave')}
						iconKey='log-out'
						icon={iconLogout}
						iconPosition='right'
						iconJustify='between'
						onPress={_doLogout}
					/>
				</View>
			)}

			<View className='flex justify-center w-full items-center mt-8 mb-4'>
				<PoweredBy />
			</View>

			<BottomInset />
		</Page>
	)
}
