import { useState } from 'react'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { CustomInput, Loading, CustomButton } from 'eitri-shopping-montreal-shared'
import { Button } from 'eitri-shopping-montreal-shared'
import { useTranslation } from 'eitri-i18n'
import { View, Text } from 'eitri-luminus'

export default function GiftCardInput(props) {
	const { cart, selectPaymentOption } = useLocalShoppingCart()
	const [isLoading, setIsLoading] = useState(false)
	const [redemptionCode, setRedemptionCode] = useState('')
	const { t } = useTranslation()

	const addGiftCard = async () => {
		try {
			setIsLoading(true)
			const payload = {
				payments: cart.paymentData.payments,
				giftCards: [
					...cart.paymentData.giftCards,
					{
						redemptionCode: redemptionCode,
						inUse: true,
						isSpecialCard: false
					}
				]
			}
			await selectPaymentOption(payload)
			setRedemptionCode('')
			setIsLoading(false)
		} catch (e) {
			console.error('Error adding gift card:', e)
			setIsLoading(false)
		}
	}

	const removeGiftCart = async giftId => {
		try {
			const newGiftCardList = cart?.giftCards?.filter(gift => gift.id !== giftId)
			setIsLoading(true)
			const payload = {
				payments: cart.paymentData.payments,
				giftCards: newGiftCardList
			}
			await selectPaymentOption(payload)
			setRedemptionCode('')
			setIsLoading(false)
		} catch (e) {
			console.error('Error removing gift card:', e)
			setIsLoading(false)
		}
	}

	return (
		<View>
			<Text className='text-sm font-bold mb-2'>Adicionar vale presente</Text>
			<View className='flex justify-between mt-2 gap-2 items-end w-full'>
				<View className='w-2/3'>
					<CustomInput
						placeholder='Insira o código do vale presente'
						value={redemptionCode}
						onChange={setRedemptionCode}
					/>
				</View>
				<View className='w-1/3'>
					<CustomButton
						label='Adicionar'
						className='grow'
						onPress={addGiftCard}
					/>
				</View>
			</View>

			<View className='flex flex-col gap-2'>
				{isLoading && (
					<View className='flex justify-center my-2'>
						<Loading inline />
					</View>
				)}
				{!isLoading &&
					cart?.giftCards?.length > 0 &&
					cart?.giftCards?.map(gift => (
						<View
							key={gift.id}
							className='py-2 px-1 border border-gray-400 rounded-sm flex flex-row items-center justify-between mt-1 gap-5'>
							<View className='flex flex-row gap-1'>
								<Text className='text-sm'>{`${gift.redemptionCode} - ${gift.formattedValue}`} </Text>
							</View>
							<View className='flex flex-row items-center justify-between'>
								<Text className='text-xs font-bold'>{gift.name}</Text>
								<CustomButton onClick={() => removeGiftCart(gift.id)}>
									<Text className='text-xs font-bold text-blue-500'>
										{t('giftCardInput.txtRemove')}
									</Text>
								</CustomButton>
							</View>
						</View>
					))}
			</View>
		</View>
	)
}
