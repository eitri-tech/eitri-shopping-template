import { CustomButton, HeaderReturn, HeaderContentWrapper, HeaderText } from 'shopping-vtex-template-shared'
import { closeEitriApp } from '../services/navigationService'
import cartImage from '../assets/images/cart-01.svg'
import { useTranslation } from 'eitri-i18n'

export default function EmptyCart() {
	const { t } = useTranslation()

	return (
		<Page title='Checkout - Carrinho Vazio'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text={t('personalData.title')} />
			</HeaderContentWrapper>

			<View className='flex flex-col items-center justify-center gap-[25px] mt-10 mb-6'>
				<Image
					src={cartImage}
					className='w-[50px]'
				/>

				<View className='flex flex-col justify-start self-center'>
					<Text className='font-bold text-primary-base text-xl text-center'>
						{t('emptyCart.txtEmptyCart')}
					</Text>
					<Text className='mt-6 text-neutral-700 text-base text-center'>{t('emptyCart.txtAddItem')}</Text>
				</View>

				<View className='w-[80vw]'>
					<CustomButton
						label={t('emptyCart.labelBack')}
						onPress={closeEitriApp}
						block
					/>
				</View>
			</View>
		</Page>
	)
}
