import { CustomButton, HEADER_TYPE, HeaderTemplate } from 'eitri-shopping-vtex-daisy-shared'
import { closeEitriApp } from '../services/navigationService'
import cartImage from '../assets/images/cart-01.svg'
import { useTranslation } from 'eitri-i18n'

export default function EmptyCart() {
	const { t } = useTranslation()

	return (
		<Window bottomInset topInset>

			<HeaderTemplate
				headerType={HEADER_TYPE.RETURN_AND_TEXT}
				viewBackButton={true}
				contentText={t('emptyCart.title')}
			/>

			<View
				display='flex'
				marginTop='jumbo'
				direction='column'
				alignItems='center'
				justifyContent='center'
				gap='25px'
				marginBottom='medium'>
				<Image
					src={cartImage}
					width={'50px'}
				/>
				<View
					display='flex'
					direction='column'
					justifyContent='start'
					alignSelf='center'>
					<Text
						fontWeight='bold'
						color='primary-base'
						fontSize='extra-large'
						textAlign='center'>
							{t('emptyCart.txtEmptyCart')}						
					</Text>
					<Text
						marginTop='large'
						color='neutral-700'
						fontSize='medium'
						textAlign='center'>
							{t('emptyCart.txtAddItem')}
					</Text>
				</View>
				<View width='80vw'>
					<CustomButton
						borderRadius='pill'
						marginTop='large'
						label={t('emptyCart.labelBack')}
						onPress={closeEitriApp}
						block
					/>
				</View>
			</View>
		</Window>
	)
}
