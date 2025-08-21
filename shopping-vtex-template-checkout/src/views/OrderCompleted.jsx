import { Page, View, Text } from 'eitri-luminus'
import { sendPageView } from '../services/trackingService'
import { Spacing, CustomButton, HeaderTemplate, HEADER_TYPE } from 'eitri-shopping-montreal-shared'
import { goHome, openAccount } from '../services/navigationService'
import { useTranslation } from 'eitri-i18n'

export default function OrderCompleted(props) {
	const orderId = props.location?.state?.orderId
	const { t } = useTranslation()

	useEffect(() => {
		sendPageView('OrderCompleted')
	}, [])

	return (
		<Page topInset>
			<HeaderTemplate
				headerType={HEADER_TYPE.RETURN_AND_TEXT}
				viewBackButton={true}
				contentText={t('orderCompleted.title')}
			/>
			<View className='p-10 flex flex-col mt-4 gap-5'>
				<View className='flex flex-col w-full items-center justify-center'>
					<svg
						height='45px'
						width='45px'
						viewBox='0 0 310.277 310.277'
						fill='#000000'>
						<g>
							<path
								style={{ fill: '#12805C' }}
								d='M155.139,0C69.598,0,0,69.598,0,155.139c0,85.547,69.598,155.139,155.139,155.139 c85.547,0,155.139-69.592,155.139-155.139C310.277,69.598,240.686,0,155.139,0z M144.177,196.567L90.571,142.96l8.437-8.437 l45.169,45.169l81.34-81.34l8.437,8.437L144.177,196.567z'
							/>
						</g>
					</svg>
					<Spacing height={15} />
					<Text className='w-full text-center text-4xl font-bold'>
						{t('orderCompleted.txtCongratulation')}
					</Text>
				</View>

				<View className='my-4'>
					<Text className='text-lg w-full text-center'>{t('orderCompleted.txtOrderSuccessful')}</Text>
				</View>

				<View className='bg-neutral-100 px-4 py-6 mt-2 flex justify-center items-center'>
					<Text className='text-lg font-bold'>{t('orderCompleted.txtOrderNumber')}</Text>
					&nbsp;
					<Text className='text-sm'>{orderId}</Text>
				</View>

				<Text className='text-lg text-center'>{t('orderCompleted.txtOrderFollow')}</Text>

				<View className='flex flex-col justify-center items-center'>
					<CustomButton
						borderRadius='pill'
						marginTop='large'
						label={t('orderCompleted.labelSeeOrders')}
						onPress={openAccount}
						block
					/>
					<Spacing height={15} />
					<CustomButton
						borderRadius='pill'
						marginTop='large'
						label={t('orderCompleted.labelBack')}
						onPress={goHome}
						backgroundColor='accent-100'
						color='primary-700'
						block
					/>
				</View>
			</View>
		</Page>
	)
}
