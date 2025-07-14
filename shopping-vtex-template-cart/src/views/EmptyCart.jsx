import Eitri from 'eitri-bifrost'
import { View, Text, Image } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'
import iconCart from '../assets/images/cart-01.svg'
import { CustomButton } from 'shopping-vtex-template-shared'

export default function EmptyCart(props) {
	const showCloseButton = props?.location?.state?.showCloseButton

	const { t } = useTranslation()

	const closeEitriApp = () => {
		Eitri.navigation.close()
	}

	return (
		<Page>
			<View className='flex flex-1 flex-col justify-center items-center min-h-screen px-6 py-12'>
				<View className='flex flex-col items-center gap-6 w-full max-w-xs'>
					<Image
						src={iconCart}
						className='w-16 mb-2'
					/>
					<Text className='font-bold text-primary-base text-2xl text-center mb-2'>
						{t('emptyCart.txtEmptyCart')}
					</Text>
					<Text className='text-neutral-700 text-base text-center mb-6'>{t('emptyCart.txtMessageList')}</Text>
					{showCloseButton && (
						<View className='w-full mt-2'>
							<CustomButton
								label={t('emptyCart.labelButton')}
								onPress={closeEitriApp}
								className='btn-primary w-full'
							/>
						</View>
					)}
				</View>
			</View>
		</Page>
	)
}
