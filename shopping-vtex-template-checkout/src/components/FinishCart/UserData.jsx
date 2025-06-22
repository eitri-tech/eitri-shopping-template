import Eitri from 'eitri-bifrost'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import SimpleCard from '../Card/SimpleCard'
import personalIcon from '../../assets/images/personal.svg'
import { removeClientData } from '../../services/cartService'
import { useTranslation } from 'eitri-i18n'
import { View, Text, Button } from 'eitri-bifrost'

export default function UserData(props) {
	const { cart, startCart } = useLocalShoppingCart()
	const { clientProfileData, onPress } = props
	const { email, firstName, lastName, document, phone } = clientProfileData || {}
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

	return (
		<SimpleCard
			isFilled={email}
			onPress={onPress}
			title={t('userData.txtPersonData')}
			icon={personalIcon}
			index='1'>
			<View className="flex flex-col">
				<View className="flex flex-row justify-between">
					<Text className="text-xs mb-1">
						{email}
					</Text>
					{clientProfileData && !cart.canEditData && (
						<Button onClick={clearClientData}>
							<Text className="text-xs text-primary-300 underline">
								{t('userData.txtMessageLeave')}
							</Text>
						</Button>
					)}
				</View>
				<Text className="text-xs mb-1">{`${firstName} ${lastName}`}</Text>
				<Text className="text-xs mb-1">{document}</Text>
				<Text className="text-xs mb-1">{phone}</Text>
			</View>
		</SimpleCard>
	)
}
