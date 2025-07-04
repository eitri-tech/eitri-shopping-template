import { useState, useEffect } from 'react'
import MethodIcon from '../../Icons/MethodIcon'
import CardIcon from '../../Icons/CardIcons/CardIcon'
import { useLocalShoppingCart } from '../../../providers/LocalCart'
import GroupsWrapper from './GroupsWrapper'
import Card from '../../Icons/MethodIcons/Card'
import { CustomInput } from 'shopping-vtex-template-shared'
import { View, Text, Dropdown, Checkbox } from 'eitri-luminus'

export default function CreditCard(props) {
	const { cart, cardInfo, setCardInfo } = useLocalShoppingCart()

	const { onSelectPaymentMethod, systemGroup, groupName } = props

	const [billingAddressSame, setBillingAddressSame] = useState(true)
	const [invalidCard, setInvalidCard] = useState(false)
	const [paymentSystemName, setPaymentSystemName] = useState('')

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
				selectInstallment(paymentSystem.installments[0])
			} else {
				setInvalidCard(true)
				selectInstallment(null)
			}
		} else {
			setInvalidCard(true)
			selectInstallment(null)
		}
	}, [cardInfo?.cardNumber])

	useEffect(() => {
		const { cardNumber, holderName, expirationDate, securityCode } = cardInfo ?? {}
		const { street, number, city, neighborhood, state, country, postalCode } = cardInfo?.billingAddress ?? {}

		if (
			cardNumber &&
			holderName &&
			expirationDate &&
			securityCode &&
			street &&
			number &&
			city &&
			neighborhood &&
			state &&
			country &&
			postalCode
		) {
			const payload = {
				accountId: null,
				bin: null,
				hasDefaultBillingAddress: true,
				installments: `${cardInfo?.installment?.count}`,
				installmentsInterestRate: null,
				isLuhnValid: null,
				isRegexValid: null,
				paymentSystem: cardInfo?.paymentSystem?.stringId,
				referenceValue: cardInfo?.installment?.value ?? cart?.value,
				tokenId: null,
				value: cardInfo?.installment?.total ?? cart?.value
			}

			setCardInfo(prev => ({ ...prev, payload, isReadyToPay: true }))
		}
	}, [cardInfo])

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

	const handleAddressChange = (key, value) => {
		const billingAddress = { ...cardInfo?.billingAddress, [key]: value }
		setCardInfo(prev => ({ ...prev, billingAddress }))
	}

	// Métodos que resolvem billing address
	const checkBillingAddressSame = () => {
		const billingAddressWillBeSame = !billingAddressSame

		if (billingAddressWillBeSame) {
			setBillingAddressSameOfShippingAddress()
		}

		setBillingAddressSame(billingAddressWillBeSame)
	}

	const setBillingAddressSameOfShippingAddress = () => {
		const { street, number, city, neighborhood, state, country, postalCode } = cart?.shipping?.address ?? {}
		const billingAddress = { street, number, city, neighborhood, state, country, postalCode }
		setCardInfo(prev => ({ ...prev, billingAddress }))
	}

	const handlePostalCodeChange = async (key, value) => {
		// if (!/^\d{5}-?\d{3}$/.test(value)) {
		// 	handleAddressChange(key, value)
		// 	return
		// }
		//
		// try {
		// 	const result = await loadAddressFromPostalCode(value)
		// 	const { street, neighborhood, city, state, country } = result
		// 	const billingAddress = {
		// 		...selectedPaymentData.billingAddress,
		// 		street,
		// 		neighborhood,
		// 		city,
		// 		state,
		// 		country,
		// 		postalCode: value
		// 	}
		// 	setSelectedPaymentData({ ...selectedPaymentData, billingAddress })
		// } catch (e) {
		// 	console.error('Error ao carregar endereço pelo CEP:', e)
		// }
	}

	// console.log('systemGroup', JSON.stringify(systemGroup))

	const currentDeliveryIsPickUp = () => {
		return cart.shipping?.options?.some(option => option.isPickupInPoint && option.isCurrent)
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
						color='accent-100'
						label='Validade'
						placeholder={'DD/MM'}
						value={cardInfo?.expirationDate}
						onChange={text => handleCardDataChange('expirationDate', text)}
						inputMode='numeric'
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
					{/*<Dropdown*/}
					{/*	required={true}*/}
					{/*	disabled={!selectedPaymentData?.paymentSystem?.installments?.length}*/}
					{/*	placeholder='Parcelamento'*/}
					{/*	onChange={selectInstallment}*/}
					{/*	value={selectedPaymentData?.cardInfo?.installment?.label}>*/}
					{/*	{selectedPaymentData?.paymentSystem?.installments?.map((option, index) => (*/}
					{/*		<Dropdown.Item*/}
					{/*			key={option.count}*/}
					{/*			value={option}*/}
					{/*			label={option.label}*/}
					{/*		/>*/}
					{/*	))}*/}
					{/*</Dropdown>*/}
				</View>
				<View className='my-1'>
					<Text className='text-accent-100 font-bold'>Endereço de cobrança:</Text>
					{cart.shipping?.address && !currentDeliveryIsPickUp() && (
						<View className='mt-1 flex flex-row gap-2 items-center'>
							<Checkbox
								name='billingAddress'
								value='Sim'
								checked={billingAddressSame}
								onChange={checkBillingAddressSame}
							/>
							<Text className='text-accent-100'>Seu endereço de fatura é o mesmo da entrega</Text>
						</View>
					)}
					{(!billingAddressSame || currentDeliveryIsPickUp()) && (
						<View className='mt-1 flex flex-col gap-2'>
							<View>
								<CustomInput
									color='accent-100'
									inputMode='numeric'
									maxLength={9}
									placeholder='CEP'
									value={cardInfo?.billingAddress?.postalCode}
									onChange={text => handlePostalCodeChange('postalCode', text)}
									className='w-2/5'
								/>
							</View>
							<View>
								<CustomInput
									color='accent-100'
									placeholder={'Rua/ Avenida'}
									value={cardInfo?.billingAddress?.street}
									onChange={text => handleAddressChange('street', text)}
								/>
							</View>

							<View className='flex flex-row gap-4'>
								<View className='w-1/2'>
									<CustomInput
										color='accent-100'
										placeholder={'Número'}
										value={cardInfo?.billingAddress?.number}
										onChange={text => handleAddressChange('number', text)}
									/>
								</View>
								<View className='w-1/2'>
									<CustomInput
										color='accent-100'
										placeholder={'Complemento'}
										value={cardInfo?.billingAddress?.complement}
										onChange={text => handleAddressChange('complement', text)}
									/>
								</View>
							</View>
							<View>
								<CustomInput
									color='accent-100'
									placeholder={'Bairro'}
									value={cardInfo?.billingAddress?.neighborhood}
									onChange={text => handleAddressChange('neighborhood', text)}
								/>
							</View>
							<View className='flex flex-row gap-4'>
								<View className='w-1/2'>
									<CustomInput
										color='accent-100'
										placeholder={'Cidade'}
										value={cardInfo?.billingAddress?.city}
										onChange={text => handleAddressChange('city', text)}
									/>
								</View>
								<View className='w-1/2'>
									<CustomInput
										color='accent-100'
										placeholder={'Estado'}
										value={cardInfo?.billingAddress?.state}
										onChange={text => handleAddressChange('state', text)}
									/>
								</View>
							</View>
						</View>
					)}
				</View>
			</View>
		</GroupsWrapper>
	)
}
