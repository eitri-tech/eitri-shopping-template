import iconFacebook from '../../assets/images/social_facebook.svg'
import iconApple from '../../assets/images/social_apple.svg'
import iconGoogle from '../../assets/images/social_google.svg'
import { useTranslation } from 'eitri-i18n'

export default function SocialLogin(props) {
	const { labelGoogle } = props

	const { t } = useTranslation()

	return (
		<View
			direction='column'
			gap='8px'
			{...props}>
			{/* <View
				customColor='#3D5A98'
				borderRadius='pill'
				height='48px'
				alignItems='center'
				padding='small'
				justifyContent='between'
				display='flex'
				onClick={() => console.log('login face')}>
				<Image
					src={iconFacebook}
					width='24px'
					height='24px'
				/>
				<Text
					block
					color='background-color'
					fontWeight='medium'>
					Continuar com Facebook
				</Text>
				<View />
			</View> */}

			<View
				borderRadius='pill'
				height='48px'
				alignItems='center'
				padding='small'
				justifyContent='between'
				borderColor='neutral-700'
				borderWidth='hairline'
				display='flex'
				onClick={() => console.log('login google')}>
				<Image
					src={iconGoogle}
					width='24px'
					height='24px'
				/>
				<Text
					block
					color='background-color'
					fontWeight='medium'>
					{labelGoogle || t('socialLogin.lbButton')}
				</Text>
				<View />
			</View>
			{/* <View
				customColor='#000000'
				borderRadius='pill'
				height='48px'
				alignItems='center'
				padding='small'
				justifyContent='between'
				display='flex'>
				<Image
					src={iconApple}
					width='24px'
					height='24px'
				/>
				<Text
					block
					color='neutral-700'
					fontWeight='medium'>
					Continuar com a Apple
				</Text>
				<View />
			</View> */}
		</View>
	)
}
