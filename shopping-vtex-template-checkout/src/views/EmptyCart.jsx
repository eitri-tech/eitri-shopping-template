import { closeEitriApp } from '../services/navigationService'
import cartImage from '../assets/images/cart-01.svg'
import { useTranslation } from 'eitri-i18n'
import { goToCartman } from '../utils/utils'
import { trackScreenView } from '../services/Tracking'
import { HeaderContentWrapper, HeaderReturn, HeaderText, CustomButton } from 'shopping-vtex-template-shared'

export default function EmptyCart() {
	const { t } = useTranslation()

	useEffect(() => {
		trackScreenView(`checkout_vazio`, 'checkout.emptyCart')
	}, [])

	return (
		<Page title='Checkout - Carrinho Vazio'>
			<HeaderContentWrapper>
				<HeaderReturn />
				<View onClick={goToCartman}>
					<HeaderText text={t('emptyCart.title')} />
				</View>
			</HeaderContentWrapper>

			<View
				topInset
				bottomInset
				className='flex flex-col items-center justify-center gap-[25px] mt-10 mb-6 p-4'>
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

				<CustomButton
					className={'w-full'}
					label={t('emptyCart.labelBack')}
					onPress={closeEitriApp}
				/>
			</View>
		</Page>
	)
}
