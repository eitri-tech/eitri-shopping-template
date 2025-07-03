import CreditCard from './Groups/CreditCard'
import BankInvoice from './Groups/BankInvoice'
import InstantPayment from './Groups/InstantPayment'

export default function ImplementationInterface(props) {
	const { groupName, systemGroup, paymentSystems, onSelectPaymentMethod } = props

	const PAYMENT_GROUPS_IMPLEMENTATION = {
		creditCardPaymentGroup: CreditCard,
		bankInvoicePaymentGroup: BankInvoice,
		instantPaymentPaymentGroup: InstantPayment
	}

	if (!groupName || !PAYMENT_GROUPS_IMPLEMENTATION[groupName]) {
		return null
	}

	const Implementation = PAYMENT_GROUPS_IMPLEMENTATION[groupName]

	/*prettier-ignore*/
	return React.createElement(Implementation, { paymentSystems, groupName, systemGroup, onSelectPaymentMethod })
}
