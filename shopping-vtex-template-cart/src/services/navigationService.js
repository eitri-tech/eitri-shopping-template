import Eitri from 'eitri-bifrost'

export const navigateToCheckout = orderFormId => {
	Eitri.nativeNavigation.open({
		slug: 'checkout',
		initParams: { orderFormId }
	})
}
