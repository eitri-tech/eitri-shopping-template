import Eitri from 'eitri-bifrost'
import { View, Text, Image } from 'eitri-luminus'
import { useTranslation } from 'eitri-i18n'
import iconCart from '../assets/images/cart-01.svg'
import {
	HeaderContentWrapper,
	HeaderReturn,
	HeaderText,
	CustomButton,
	BottomInset
} from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'

export default function EmptyCart(props) {
	const openWithBottomBar = props?.location?.state?.openWithBottomBar

	const { t } = useTranslation()
	const { startCart } = useLocalShoppingCart()

	useEffect(() => {
		Eitri.navigation.setOnResumeListener(async () => {
			const cart = await startCart()
			if (cart && cart.items?.length > 0) {
				Eitri.navigation.navigate({ path: 'Home', replace: true })
			}
		})
	}, [])

	const closeEitriApp = () => {
		Eitri.navigation.close()
	}

	return (
		<Page>
			<View className={'min-h-[100vh] flex flex-col'}>
				<HeaderContentWrapper>
					{!openWithBottomBar && <HeaderReturn />}
					<HeaderText text={t('home.title')} />
				</HeaderContentWrapper>

				<View className='flex flex-1 flex-col justify-center items-center'>
					<View className='flex flex-col items-center gap-6 w-full max-w-xs'>
						<Image
							src={iconCart}
							className='w-16 mb-2'
						/>
						<Text className='font-bold text-primary-base text-2xl text-center mb-2'>
							{t('emptyCart.txtEmptyCart')}
						</Text>
						<Text className='text-neutral-700 text-base text-center mb-6'>
							{t('emptyCart.txtMessageList')}
						</Text>
						{!openWithBottomBar && (
							<View className='w-full mt-2'>
								<CustomButton
									label={t('emptyCart.labelButton')}
									onPress={closeEitriApp}
									className='btn-primary w-full'
								/>
							</View>
						)}
					</View>
					<BottomInset />
				</View>
			</View>
		</Page>
	)
}
