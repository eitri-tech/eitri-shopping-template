import { App } from 'eitri-shopping-vtex-shared'
import CreditCard from './Groups/CreditCard'
import BankInvoice from './Groups/BankInvoice'
import InstantPayment from './Groups/InstantPayment'
import GiftCard from './Groups/GiftCard'
import Eitri from 'eitri-bifrost'

export default function ImplementationInterface(props) {
	const { groupName, systemGroup, paymentSystems, onSelectPaymentMethod } = props

	const PAYMENT_GROUPS_IMPLEMENTATION = {
		creditCardPaymentGroup: CreditCard,
		bankInvoicePaymentGroup: BankInvoice,
		instantPaymentPaymentGroup: InstantPayment,
		giftCardPaymentGroup: GiftCard
	}

	const externalPaymentsImplementation = App.configs.appConfigs?.externalPayments ?? []

	const externalPaymentRc = externalPaymentsImplementation.find(
		externalPayment => externalPayment.externalGroupName === groupName
	)

	Eitri.environment
		.getRemoteConfigs()
		.then(res => {
			console.log('res', res)
		})
		.catch(err => {
			console.log('err', err)
		})

	console.log('externalPayment', App.configs.appConfigs)
	console.log('externalPaymentRc', groupName)
	if ((!groupName || !PAYMENT_GROUPS_IMPLEMENTATION[groupName]) && !externalPaymentRc) {
		return null
	}

	if (externalPaymentRc) {
		return (
			<ExternalPayment
				systemGroup={systemGroup}
				paymentSystems={paymentSystems}
				groupName={groupName}
				externalPaymentRc={externalPaymentRc}
				onSelectPaymentMethod={onSelectPaymentMethod}
			/>
		)
	}

	if (!groupName || !PAYMENT_GROUPS_IMPLEMENTATION[groupName]) {
		return null
	}

	const Implementation = PAYMENT_GROUPS_IMPLEMENTATION[groupName]

	/*prettier-ignore*/
	return React.createElement(Implementation, { paymentSystems, groupName, systemGroup, onSelectPaymentMethod })
}
