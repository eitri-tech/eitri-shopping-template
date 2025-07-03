import Eitri from 'eitri-bifrost'

export const navigate = (from, cart) => {
	if (from === 'FreightSelector') {
		Eitri.navigation.navigate({ path: 'FinishCart' })
	}
}
