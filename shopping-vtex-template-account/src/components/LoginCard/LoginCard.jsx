import { useTranslation } from 'eitri-i18n'
import { CustomButton } from 'shopping-vtex-template-shared'
import { navigate, PAGES } from '../../services/NavigationService'

export default function LoginCard(props) {
	const { t } = useTranslation()

	return (
		<View className='p-4'>
			<View className='flex flex-col gap-4 shadow-sm bg-white rounded border border-gray-300 p-4 w-full'>
				<View className='flex flex-col gap-1'>
					<Text className='text-lg font-bold text-gray-800'>{t('loginCard.lbOpen', 'Entrar')}</Text>
					<Text className='text-gray-600 leading-relaxed'>
						{t('loginCard.infoPage', 'Acesse suas informações de perfil')}
					</Text>
				</View>
				<CustomButton
					label={t('loginCard.lbButton', 'Entrar ou criar conta')}
					onPress={() => navigate(PAGES.SIGNIN, { redirectTo: 'Home' })}
				/>
			</View>
		</View>
	)
}
