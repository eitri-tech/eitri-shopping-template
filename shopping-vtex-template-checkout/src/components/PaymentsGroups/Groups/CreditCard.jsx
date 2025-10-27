import { useLocalShoppingCart } from '../../../providers/LocalCart'
import GroupsWrapper from './GroupsWrapper'
import Card from '../../Icons/MethodIcons/Card'
import { Text, View } from 'eitri-luminus'
import CardIcon from '../../Icons/CardIcons/CardIcon'
import { navigate } from '../../../services/navigationService'
import { useCustomer } from '../../../providers/Customer'
import { trackAddPaymentInfo } from '../../../services/Tracking'
import { CustomButton, CustomInput } from 'shopping-vtex-template-shared'

export default function CreditCard(props) {
	const { onSelectPaymentMethod, systemGroup } = props

	const { cart, setCardInfo, cardInfo } = useLocalShoppingCart()
	const { checkoutProfile } = useCustomer()

	const [availableAccounts, setAvailableAccounts] = useState([])
	const [accountSelected, setAccountSelected] = useState(null)

	useEffect(() => {
		if (cart?.paymentData?.availableAccounts) {
			setAvailableAccounts(cart?.paymentData?.availableAccounts)
		}
		if (checkoutProfile?.availableAccounts) {
			setAvailableAccounts(checkoutProfile?.availableAccounts)
		}
	}, [checkoutProfile, cart])

	const setPaymentSystem = async () => {
		const paymentSystem = systemGroup?.paymentSystems?.find(
			system => system.stringId === accountSelected?.paymentSystem
		)
		if (!paymentSystem) return
		await onSelectPaymentMethod([
			{
				paymentSystem: paymentSystem.id,
				installmentsInterestRate: 0,
				installments: 1,
				referenceValue: cart.value,
				value: cart.value,
				hasDefaultBillingAddress: true
			}
		])
		//trackAddPaymentInfo(cart, paymentSystem.name)
		navigate('Installments', { paymentSystem })
	}

	const selectCart = async account => {
		setAccountSelected(account)
		setCardInfo(account)
	}

	const addNewCard = async () => {
		navigate('AddCardForm')
	}

	// https://www.lojastorra.com.br/api/checkout/pub/orderForm/a617592782db4644b4fc0d33707d8f91/paymentAccount/2D1D53BD3910447FAD34030F6AC7C90A/remove

	return (
		<GroupsWrapper
			title='Cartão de Crédito'
			icon={<Card />}>
			<View>
				{availableAccounts?.map(account => (
					<View
						key={account.id}
						onClick={() => selectCart(account)}>
						<View className='flex flex-row gap-2 items-top'>
							<CardIcon
								width={'30px'}
								iconKey={account?.paymentSystemName}
							/>
							<View className='flex flex-col'>
								<Text className='text-sm font-bold'>{`${account?.paymentSystemName}`}</Text>
								<Text className='text-sm'>{`final ${account?.cardNumber?.replaceAll('*', '')}`}</Text>
							</View>
						</View>
					</View>
				))}
				{accountSelected && (
					<View className='flex flex-row gap-3 items-end mt-2'>
						<View className='w-2/4'>
							<CustomInput
								inputMode='numeric'
								variant='mask'
								mask='9999'
								label='Cód. Segurança'
								placeholder={'Cód. Segurança'}
								value={cardInfo?.validationCode || ''}
								onChange={e => setCardInfo({ ...cardInfo, validationCode: e.target.value })}
							/>
						</View>
						<View className='w-2/4'>
							<CustomButton
								onClick={setPaymentSystem}
								disabled={!cardInfo?.validationCode}
								label='Continuar'
							/>
						</View>
					</View>
				)}
			</View>
			<View className='border-b my-4'></View>

			<View onClick={addNewCard}>
				<Text className='text-primary font-bold'>Cadastrar novo cartão</Text>
			</View>
		</GroupsWrapper>
	)
}
