import { useState, useEffect } from 'react'
import CardIcon from '../../Icons/CardIcons/CardIcon'
import { useLocalShoppingCart } from '../../../providers/LocalCart'
import GroupsWrapper from './GroupsWrapper'
import Card from '../../Icons/MethodIcons/Card'
import { CustomInput } from 'eitri-shopping-montreal-shared'
import { View, Text, Checkbox } from 'eitri-luminus'
import CreditCardBillingAddress from './Components/CreditCardBillingAddress'

export default function CreditCard(props) {
	const { cart, cardInfo, setCardInfo } = useLocalShoppingCart()

	const { onSelectPaymentMethod, systemGroup } = props

	const [invalidCard, setInvalidCard] = useState(false)
	const [paymentSystemName, setPaymentSystemName] = useState('')
	const [installmentOptions, setInstallmentOptions] = useState([])

	useEffect(() => {
		if (cardInfo?.cardNumber && cardInfo?.cardNumber.length > 15) {
			const paymentSystem = systemGroup?.paymentSystems?.find(method => {
				const regex = RegExp(method.validator.regex)
				return regex.test(cardInfo?.cardNumber.replace(/\D+/g, ''))
			})

			if (paymentSystem) {
				setInvalidCard(false)

				const cartPaymentSystemIsChange = !cart?.paymentData?.payments?.some(
					payment => payment.paymentSystem === paymentSystem?.stringId
				)

				if (cartPaymentSystemIsChange) {
					setPaymentSystem(paymentSystem, true)
				}
				setPaymentSystemName(paymentSystem.name)
				setInstallmentOptions(paymentSystem.installments)
			} else {
				setInvalidCard(true)
				setInstallmentOptions([])
			}
		} else {
			setInvalidCard(true)
			setInstallmentOptions([])
		}
	}, [cardInfo?.cardNumber])

	const onSelectThisGroup = () => {
		const firstPaymentSystem = systemGroup.paymentSystems[0]
		setPaymentSystem(firstPaymentSystem)
	}

	const setPaymentSystem = async (paymentSystem, silentMode) => {
		onSelectPaymentMethod(
			[
				{
					paymentSystem: paymentSystem.id,
					installmentsInterestRate: 0,
					installments: 1,
					referenceValue: cart.value,
					value: cart.value,
					hasDefaultBillingAddress: true
				}
			],
			silentMode
		)
	}

	const selectInstallment = installment => {
		setCardInfo(prev => ({
			...prev,
			installment: installment
		}))
	}

	const handleCardDataChange = (key, e) => {
		const value = e.target.value
		setCardInfo(prev => ({ ...prev, [key]: value }))
	}

	return (
		<GroupsWrapper
			title='Cartão de Crédito'
			icon={<Card />}
			onPress={onSelectThisGroup}
			isChecked={systemGroup?.isCurrentPaymentSystemGroup}>
			<View>
				<Text className='text-accent-100 font-bold'>Bandeiras aceitas:</Text>
				<View className='flex gap-1 justify-between mt-2'>
					{systemGroup?.paymentSystems?.map(system => {
						return (
							<View
								key={system.name}
								className='flex-1'>
								<View className='flex justify-center items-center w-full'>
									<CardIcon
										width={'100%'}
										iconKey={system.name}
									/>
								</View>
							</View>
						)
					})}
				</View>
			</View>

			<View className='flex flex-col gap-2 mt-4'>
				<View className='relative'>
					<CustomInput
						color='accent-100'
						fontSize='extra-small'
						placeholder={'XXXX XXXX XXXX XXXX'}
						label={'Número do cartão'}
						value={cardInfo?.cardNumber}
						inputMode='numeric'
						mask='9999 9999 9999 9999'
						variant='mask'
						onChange={e => handleCardDataChange('cardNumber', e)}
					/>
					{invalidCard && cardInfo?.cardNumber && (
						<Text className='mt-1 font-bold text-accent-100 text-xs'>Verifique o número digitado</Text>
					)}
					{paymentSystemName && (
						<View className='absolute top-[38px] right-3'>
							<CardIcon
								height={25}
								width={39}
								iconKey={paymentSystemName}
							/>
						</View>
					)}
				</View>

				<CustomInput
					showClearInput={false}
					placeholder={'Nome impresso no cartão'}
					label={'Nome impresso no cartão'}
					value={cardInfo?.holderName}
					onChange={text => handleCardDataChange('holderName', text)}
				/>
				<View className='flex gap-2 w-full flex-row'>
					<CustomInput
						label='Validade'
						placeholder={'DD/MM'}
						value={cardInfo?.expirationDate}
						onChange={text => handleCardDataChange('expirationDate', text)}
						inputMode='numeric'
						variant='mask'
						mask='99/99'
					/>
					<CustomInput
						color='accent-100'
						label='CVV'
						placeholder={'CVV'}
						value={cardInfo?.securityCode}
						onChange={text => handleCardDataChange('securityCode', text)}
						inputMode='numeric'
						mask='9999'
					/>
				</View>
				<View>
					<View className='mb-1'>
						<Text className='text-accent-100 text-xs font-bold'>Parcelamento</Text>
					</View>
					<Select
						required={true}
						disabled={!installmentOptions?.length}
						placeholder='Parcelamento'
						className={'w-full'}
						onChange={selectInstallment}
						value={1}>
						{installmentOptions?.map((option, index) => (
							<Select.Item
								key={option.count}
								value={option.count}>
								{option.label}
							</Select.Item>
						))}
					</Select>
				</View>

				<CreditCardBillingAddress />
			</View>
		</GroupsWrapper>
	)
}
