import {
	CustomButton,
	HEADER_TYPE,
	HeaderTemplate,
	HeaderText,
	Loading,
	HeaderContentWrapper
} from 'shopping-vtex-template-shared'
import { doLogout, getCustomerData, isLoggedIn } from '../services/CustomerService'
import { navigate, PAGES } from '../services/NavigationService'
import { sendPageView } from '../services/TrackingService'
import { useTranslation } from 'eitri-i18n'
import iconLogout from '../assets/icons/logout.svg'
import Eitri from 'eitri-bifrost'
import ProfileCardButton from '../components/ProfileCardButton/ProfileCardButton'
import { setLanguage, startConfigure } from '../services/AppService'
import PoweredBy from '../components/PoweredBy/PoweredBy'
import LoginCard from '../components/LoginCard/LoginCard'
import InfoCard from 'src/components/InfoCard/InfoCard'

export default function Home(props) {
	const PAGE = 'Minha Conta'

	const [isLoading, setIsLoading] = useState(true)
	const [customerData, setCustomerData] = useState(props.customerData || {})
	const { t, i18n } = useTranslation()
	const [isLogged, setIsLogged] = useState(null)

	useEffect(() => {
		init()
	}, [])

	const init = async () => {
		await startConfigure()

		setLanguage(i18n)

		const initialInfos = await Eitri.getInitializationInfos()

		if (initialInfos?.action === 'RequestLogin') {
			navigate(PAGES.SIGNIN, { closeAppAfterLogin: true }, true)
			return
		}

		const isLogged = await isLoggedIn()

		await loadMe()
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

	return (
		<Page title={PAGE}>
			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			<HeaderContentWrapper className='justify-between'>
				<HeaderText text={t('home.labelMyAccount')} />
			</HeaderContentWrapper>

			{!isLoading && (isLogged ? <InfoCard customerData={customerData} /> : <LoginCard />)}

			<View className='px-4 mt-2 mb-2'>
				<Text className='font-bold text-xl mb-3 text-gray-900'>{t('home.lbPersonalData')}</Text>
				<ProfileCardButton
					label={t('home.labelMyAccount')}
					icon={'user'}
					onClick={() => {
						isLogged
							? navigate(PAGES.EDIT_PROFILE, { customerData })
							: navigate(PAGES.SIGNIN, { redirectTo: PAGES.EDIT_PROFILE })
					}}
				/>
				<ProfileCardButton
					label={t('home.labelMyFavorites')}
					icon={'bookmark'}
					onClick={() => {
						isLogged ? navigate(PAGES.WISH_LIST) : navigate(PAGES.SIGNIN, { redirectTo: PAGES.WISH_LIST })
					}}
				/>
			</View>

			<View className='px-4 mt-6 mb-2'>
				<Text className='font-bold text-xl mb-3 text-gray-900'>{t('home.lbOrders')}</Text>
				<ProfileCardButton
					label={t('home.labelMyOrders')}
					icon={'package'}
					onClick={() => {
						isLogged ? navigate(PAGES.ORDER_LIST) : navigate(PAGES.SIGNIN, { redirectTo: PAGES.ORDER_LIST })
					}}
				/>
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

			<View className='w-full items-center mt-8 mb-4'>
				<PoweredBy />
			</View>
		</Page>
	)
}
