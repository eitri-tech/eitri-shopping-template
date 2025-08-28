import { getCustomerData } from '../services/CustomerService'

const LocalCustomer = createContext({})

export default function CustomerProvider({ children }) {
	const [customer, setCustomer] = useState(null)
	const [checkoutProfile, setCheckoutProfile] = useState(null)

	const getCustomer = async () => {
		const customer = await getCustomerData()
		if (!customer) return
		setCustomer(customer)
		return customer
	}

	return (
		<LocalCustomer.Provider
			value={{
				checkoutProfile,
				setCheckoutProfile,
				getCustomer,
				customer
			}}>
			{children}
		</LocalCustomer.Provider>
	)
}

export function useCustomer() {
	const context = useContext(LocalCustomer)

	return context
}
