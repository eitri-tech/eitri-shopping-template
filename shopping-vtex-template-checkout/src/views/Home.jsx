import { useLocalShoppingCart } from '../providers/LocalCart'
import Eitri from 'eitri-bifrost'
import { Loading } from 'shopping-vtex-template-shared'
import { saveCartIdOnStorage } from '../services/cartService'
import { useTranslation } from 'eitri-i18n'
import { setLanguage, startConfigure } from '../services/AppService'

export default function Home() {
	const { startCart } = useLocalShoppingCart()

	const { t, i18n } = useTranslation()

	useEffect(() => {
		startHome()
	}, [])

	const startHome = async () => {
		await loadConfigs()
		loadCart()
	}

	const loadCart = async () => {
		const startParams = await Eitri.getInitializationInfos()

		if (startParams?.cartman === 'on') {
			Eitri.navigation.navigate({ path: 'Cartman', replace: true })
			return
		}

		if (startParams?.orderFormId) {
			await saveCartIdOnStorage(startParams?.orderFormId)
		}

		const cart = await startCart()

		if (cart && cart?.items?.length > 0) {
			if (
				!cart.clientProfileData ||
				!cart.clientProfileData?.email ||
				!cart.clientProfileData?.firstName ||
				!cart.clientProfileData?.lastName ||
				!cart.clientProfileData?.document ||
				!cart.clientProfileData?.phone
			) {
				Eitri.navigation.navigate({ path: 'PersonalData', state: { cart: cart }, replace: true })
			} else {
				Eitri.navigation.navigate({ path: 'FinishCart', replace: true })
			}
		} else {
			Eitri.navigation.navigate({ path: 'EmptyCart', replace: true })
		}
	}

	const loadConfigs = async () => {
		try {
			await startConfigure()
			setLanguage(i18n)
		} catch (e) {
			console.log('Error ao buscar configurações', e)
		}
	}

	return (
		<View
			topInset
			bottomInset>
			<Loading fullScreen />
		</View>
	)
}
