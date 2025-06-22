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
		<Page
			bottomInset
			topInset>
			<View className='flex-1 flex flex-col py-12 px-6 justify-center items-center'>
				<View className='flex flex-col items-center justify-center gap-5 mb-4'>
					<Image
						src={iconCart}
						className='w-[50px]'
					/>
					<View className='flex flex-col justify-start self-center'>
						<Text className='font-bold text-primary-base text-3xl text-center'>
							{t('emptyCart.txtEmptyCart')}
						</Text>
						<Text className='mt-6 text-neutral-700 text-base text-center'>
							{t('emptyCart.txtMessageList')}
						</Text>
					</View>
					{showCloseButton && (
						<CustomButton
							label={t('emptyCart.labelButton')}
							onPress={closeEitriApp}
						/>
					)}
				</View>
			</View>
		</Page>
	)
}
