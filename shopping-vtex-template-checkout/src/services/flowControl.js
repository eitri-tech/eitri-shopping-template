import Eitri from 'eitri-bifrost'

export const navigate = (from, cart) => {
	if (from === 'FreightSelector') {
		Eitri.navigation.navigate({ path: 'FinishCart' })
	}

	if (from === 'PaymentData') {
		Eitri.navigation.navigate({ path: 'FinishCart' })
	}
}
