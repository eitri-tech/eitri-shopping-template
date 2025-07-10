import { Page, View, Text, Button } from 'eitri-luminus'
import Eitri from 'eitri-bifrost'
import {
	CustomButton,
	Loading,
	HeaderReturn,
	HeaderContentWrapper,
	HeaderText,
	CustomInput
} from 'shopping-vtex-template-shared'
import { useLocalShoppingCart } from '../providers/LocalCart'
import { getUserByEmail, registerToNotify } from '../services/cartService'
import { sendPageView } from '../services/trackingService'
import { useTranslation } from 'eitri-i18n'
import { goToCartman } from '../utils/utils'
import { useState, useEffect, useMemo, useCallback } from 'react'

// Função utilitária extraída para validação de CPF
function verifySocialNumber(cpf) {
	const cleanCpf = cpf?.replace(/[\.\-]/g, '')
	if (!cleanCpf || cleanCpf.length !== 11 || cleanCpf.match(/(\d)\1{10}/)) return false

	let sum = 0
	let rest

	for (let i = 1; i <= 9; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (11 - i)
	rest = (sum * 10) % 11

	if (rest === 10 || rest === 11) rest = 0
	if (rest !== parseInt(cleanCpf.substring(9, 10))) return false

	sum = 0
	for (let i = 1; i <= 10; i++) sum += parseInt(cleanCpf.substring(i - 1, i)) * (12 - i)
	rest = (sum * 10) % 11

	if (rest === 10 || rest === 11) rest = 0
	if (rest !== parseInt(cleanCpf.substring(10, 11))) return false

	return true
}

function PersonalInputs({ options, personalData, onChange }) {
	return options.map(inputOption => (
		<CustomInput
			autoFocus={inputOption.autoFocus}
			key={inputOption.label}
			label={inputOption.title}
			showClearInput={false}
			type={inputOption.type}
			value={personalData[inputOption.label] || ''}
			onChange={onChange(inputOption.label)}
			placeholder={inputOption.placeholder}
			inputMode={inputOption.inputMode}
			mask={inputOption.mask}
			variant='mask'
		/>
	))
}

function CorporateInputs({ options, personalData, onChange }) {
	return options.map(inputOption => (
		<CustomInput
			key={inputOption.label}
			label={inputOption.title}
			showClearInput={false}
			type={inputOption.type}
			value={personalData[inputOption.label] || ''}
			onChange={onChange(inputOption.label)}
			placeholder={inputOption.placeholder}
		/>
	))
}

export default function PersonalData() {
	const { cart, addCustomerData } = useLocalShoppingCart()
	const { t } = useTranslation()

	const [isLoading, setIsLoading] = useState(false)
	const [isCorporatePerson, setIsCorporatePerson] = useState(false)
	const [personalData, setPersonalData] = useState({
		email: '',
		firstName: '',
		lastName: '',
		documentType: '',
		document: '',
		phone: '',
		dob: '',
		corporateName: '',
		tradeName: '',
		corporateDocument: '',
		corporatePhone: '',
		isCorporate: false,
		stateInscription: ''
	})
	const [userDataVerified, setUserDataVerified] = useState(false)
	const [socialNumberError, setSocialNumberError] = useState(false)

	// Memoize input options
	const personalInputOptions = useMemo(
		() => [
			{
				id: 'firstName',
				label: 'firstName',
				type: 'string',
				title: t('personalData.frmName'),
				placeholder: t('personalData.placeholderName'),
				inputMode: 'string'
			},
			{
				label: 'lastName',
				type: 'string',
				title: t('personalData.frmLastName'),
				placeholder: t('personalData.placeholderLastName'),
				inputMode: 'string'
			},
			{
				label: 'document',
				type: 'string',
				title: t('personalData.frmTaxpayerId'),
				placeholder: t('personalData.placeholderTaxpayerId'),
				inputMode: 'numeric',
				mask: '999.999.999-99'
			},
			{
				label: 'phone',
				type: 'string',
				title: t('personalData.frmPhone'),
				placeholder: t('personalData.placeholderPhone'),
				inputMode: 'tel',
				mask: '(99) 9999-99999'
			}
		],
		[t]
	)

	const corporateInputOptions = useMemo(
		() => [
			{
				label: 'corporateName',
				type: 'string',
				title: t('personalData.frmCorporateName'),
				placeholder: t('personalData.placeholderCorporateName'),
				inputMode: 'string'
			},
			{
				label: 'tradeName',
				type: 'string',
				title: t('personalData.frmFantasyName'),
				placeholder: t('personalData.placeholderFantasyName'),
				inputMode: 'string'
			},
			{
				label: 'corporateDocument',
				type: 'string',
				title: t('personalData.frmCorporateDocument'),
				placeholder: t('personalData.placeholderCorporateDocument'),
				inputMode: 'numeric',
				mask: '99.999.999/9999-99'
			},
			{
				label: 'stateInscription',
				type: 'string',
				title: t('personalData.frmStateInscription'),
				placeholder: t('personalData.placeholderStateInscription'),
				inputMode: 'string'
			}
		],
		[t]
	)

	// Padronizar handler de mudança de input
	const handlePersonalDataChange = useCallback(
		key => e => {
			const value = e.target?.value ?? e
			setPersonalData(prev => ({ ...prev, [key]: value }))
		},
		[]
	)

	// Efeito para preencher dados do usuário do carrinho
	useEffect(() => {
		if (cart?.clientProfileData?.email) {
			setPersonalData(prev => ({
				...prev,
				...cart.clientProfileData
			}))
			setUserDataVerified(true)
		} else {
			setUserDataVerified(false)
		}
		sendPageView('Dados pessoais')
	}, [cart])

	// Efeito para validar CPF
	useEffect(() => {
		if (personalData?.document?.length === 11) {
			setSocialNumberError(!verifySocialNumber(personalData?.document))
		} else {
			setSocialNumberError(false)
		}
	}, [personalData?.document])

	const setUserData = useCallback(() => {
		const localPersonalData = {
			email: personalData.email,
			firstName: personalData.firstName,
			lastName: personalData.lastName,
			documentType: 'cpf',
			document: personalData.document,
			phone: personalData.phone,
			dob: personalData.dob,
			isCorporate: false,
			corporateName: '',
			tradeName: '',
			corporateDocument: '',
			corporatePhone: '',
			stateInscription: ''
		}
		addUserData(localPersonalData)
	}, [personalData])

	const addUserData = useCallback(
		async userData => {
			try {
				setIsLoading(true)
				await addCustomerData(userData, cart.orderFormId)
				Eitri.navigation.navigate({ path: 'FinishCart', replace: true })
			} catch (error) {
				console.log('error', error)
			} finally {
				setIsLoading(false)
			}
		},
		[addCustomerData, cart?.orderFormId]
	)

	const handleCorporateToggle = useCallback(() => {
		setIsCorporatePerson(prev => !prev)
	}, [])

	const findUserByEmail = useCallback(async () => {
		setIsLoading(true)
		const client = await getUserByEmail(personalData.email)
		if (client.userProfileId) {
			await addCustomerData({ email: personalData.email }, cart.orderFormId)
			Eitri.navigation.navigate({ path: 'FinishCart', replace: true })
			registerToNotify(client.userProfileId)
			setUserDataVerified(true)
		} else {
			setUserDataVerified(true)
		}
		setIsLoading(false)
	}, [personalData.email, addCustomerData, cart?.orderFormId])

	const isDataFilled = useMemo(
		() =>
			personalData?.email !== '' &&
			personalData?.firstName !== '' &&
			personalData?.lastName !== '' &&
			verifySocialNumber(personalData?.document) &&
			personalData?.phone?.length > 9,
		[personalData]
	)

	return (
		<Page title='Checkout - Dados de usuário'>
			<View className='min-h-[100vh] flex flex-col'>
				<HeaderContentWrapper
					gap={16}
					scrollEffect={false}>
					<HeaderReturn />
					<View onClick={goToCartman}>
						<HeaderText text={t('personalData.title')} />
					</View>
				</HeaderContentWrapper>

				{isLoading && <Loading fullScreen />}

				<View className='flex-1 p-4'>
					<View className='flex flex-col gap-4'>
						<View className='flex w-full items-end gap-4'>
							<CustomInput
								autoFocus={true}
								label={t('personalData.frmEmail')}
								type={'email'}
								value={personalData['email'] || ''}
								onChange={handlePersonalDataChange('email')}
								placeholder={t('personalData.placeholderEmail')}
								inputMode={'email'}
								className='w-[70%]'
							/>
							<CustomButton
								label='OK'
								className='w-[30%]'
								onPress={findUserByEmail}
							/>
						</View>

						{userDataVerified && (
							<PersonalInputs
								options={personalInputOptions}
								personalData={personalData}
								onChange={handlePersonalDataChange}
							/>
						)}

						{socialNumberError && (
							<View className='bg-negative-100 p-3 rounded-lg'>
								<Text className='text-negative-900'>{t('personalData.errorInvalidDoc')}</Text>
							</View>
						)}

						{userDataVerified && (
							<View className='flex flex-col justify-center items-center my-2'>
								<View
									className='bg-transparent'
									onClick={handleCorporateToggle}>
									<Text className='text-primary-900 font-bold'>
										{isCorporatePerson
											? t('personalData.labelPerson')
											: t('personalData.labelCorporate')}
									</Text>
								</View>
							</View>
						)}

						{userDataVerified && isCorporatePerson && (
							<CorporateInputs
								options={corporateInputOptions}
								personalData={personalData}
								onChange={handlePersonalDataChange}
							/>
						)}
					</View>
				</View>

				<View
					bottomInset
					className='p-4'>
					<CustomButton
						disabled={!isDataFilled}
						label={t('personalData.labelButton')}
						onPress={setUserData}
					/>
				</View>
			</View>
		</Page>
	)
}
