import { useLocalShoppingCart } from '../providers/LocalCart'
import Eitri from 'eitri-bifrost'
import { Loading } from 'shopping-vtex-template-shared'
import { saveCartIdOnStorage } from '../services/cartService'
import { useTranslation } from 'eitri-i18n'
import { startConfigure } from '../services/AppService'

export default function Home() {
	const { startCart } = useLocalShoppingCart()

	const { t } = useTranslation()

	useEffect(() => {
		startHome()
	}, [])

	const startHome = async () => {
		await loadConfigs()
		loadCart()
	}

	const loadCart = async () => {
		const startParams = await Eitri.getInitializationInfos()

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
		} catch (e) {
			console.log('Error ao buscar configurações', e)
		}
	}

	return (
		<Page>
			<Loading fullScreen />
		</Page>
	)
}
