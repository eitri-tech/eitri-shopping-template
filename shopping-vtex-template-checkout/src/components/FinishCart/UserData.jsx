import { useLocalShoppingCart } from '../../providers/LocalCart'
import SimpleCard from '../Card/SimpleCard'
import personalIcon from '../../assets/images/personal.svg'
import { useTranslation } from 'eitri-i18n'
import { navigate, requestLogin } from '../../services/navigationService'

export default function UserData(props) {
	const { cart, removeClientData } = useLocalShoppingCart()
	const { t } = useTranslation()

	const clearClientData = async () => {
		try {
			if (cart?.clientProfileData) {
				await removeClientData()
				navigate('PersonalData')
			}
		} catch (e) {
			console.log('Erro ao limpar dados do cliente', e)
		}
	}

	const onPressMainAction = async () => {
		try {
			if (!cart?.canEditData) {
				await requestLogin()
			}
			navigate('PersonalData')
		} catch (e) {
			console.log('Erro ao navegar para a tela de dados pessoais', e)
		}
	}

	return (
		<SimpleCard
			title={t('userData.txtPersonData')}
			isFilled={cart?.clientProfileData?.email}
			onPress={onPressMainAction}
			icon={personalIcon}>
			<View className='flex flex-col'>
				<View className='flex flex-row justify-between'>
					<Text className='text-xs mb-1'>{cart?.clientProfileData?.email}</Text>
					{cart?.clientProfileData?.email && !cart.canEditData && (
						<View onClick={clearClientData}>
							<Text className='text-xs text-primary-300 underline'>{t('userData.txtMessageLeave')}</Text>
						</View>
					)}
				</View>
				<Text className='text-xs mb-1'>{`${cart?.clientProfileData?.firstName} ${cart?.clientProfileData?.lastName}`}</Text>
				<Text className='text-xs mb-1'>{cart?.clientProfileData?.document}</Text>
				<Text className='text-xs mb-1'>{cart?.clientProfileData?.phone}</Text>
			</View>
		</SimpleCard>
	)
}
