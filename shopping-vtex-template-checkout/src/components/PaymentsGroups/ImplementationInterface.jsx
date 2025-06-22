import CreditCard from './CreditCard'
import BankInvoice from './BankInvoice'
import InstantPayment from './InstantPayment'

export default function ImplementationInterface(props) {
	const { groupName, paymentSystems } = props

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
	return React.createElement(Implementation, { paymentSystems, groupName })
}
