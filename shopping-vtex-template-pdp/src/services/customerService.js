import { Vtex } from 'eitri-shopping-vtex-shared'
import Eitri from 'eitri-bifrost'

let CheckLoginPromise = null

export const requestLogin = () => {
	return new Promise((resolve, reject) => {
		Eitri.nativeNavigation.open({
			slug: 'account',
			initParams: { action: 'RequestLogin' }
		})
		CheckLoginPromise = null
		Eitri.navigation.setOnResumeListener(resolve)
	})
}

export const isLoggedIn = async () => {
	if (CheckLoginPromise) {
		return CheckLoginPromise
	}
	CheckLoginPromise = Vtex.customer.isLoggedIn()
	return CheckLoginPromise
}

export const removeItemFromWishlist = async id => {
	return await Vtex.wishlist.removeItem(id)
}

export const addToWishlist = async (productId, title, sku) => {
	if (!(await isLoggedIn())) {
		await requestLogin()
		if (!(await isLoggedIn())) {
			throw new Error('User not logged in')
		}
		return await Vtex.wishlist.addItem(productId, title, sku)
	} else {
		return await Vtex.wishlist.addItem(productId, title, sku)
	}
}

export const productOnWishlist = async productId => {
	if (!(await isLoggedIn())) {
		return { inList: false }
	}
	const result = await Vtex.wishlist.checkItem(productId)
	const inList = result?.data?.checkList?.inList
	if (inList) {
		const listId = result?.data?.checkList?.listIds?.[0]
		return { inList, listId }
	} else {
		return { inList }
	}
}
