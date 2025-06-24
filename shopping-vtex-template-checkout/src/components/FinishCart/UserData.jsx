import Eitri from 'eitri-bifrost'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import SimpleCard from '../Card/SimpleCard'
import personalIcon from '../../assets/images/personal.svg'
import { removeClientData } from '../../services/cartService'
import { useTranslation } from 'eitri-i18n'

export default function UserData(props) {
	const { cart, startCart } = useLocalShoppingCart()
	const { onPress } = props
	const { t } = useTranslation()

	const clearClientData = async () => {
		try {
			if (cart?.clientProfileData) {
				await removeClientData()
				await startCart()
				Eitri.navigation.navigate({ path: 'PersonalData' })
			}
		} catch (e) {
			console.log('Erro ao limpar dados do cliente', e)
		}
	}

	// console.log(JSON.stringify(cart.clientProfileData))

	return (
		<SimpleCard
			isFilled={cart?.clientProfileData?.email}
			onPress={onPress}
			title={t('userData.txtPersonData')}
			icon={personalIcon}
			index='1'>
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
