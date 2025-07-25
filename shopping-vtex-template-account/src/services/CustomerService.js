import { Vtex } from 'eitri-shopping-vtex-shared'

export const doLogin = async (email, password, rememberMe) => {
	return await Vtex.customer.loginWithEmailAndPassword(email, password, rememberMe)
}

export async function loginWithEmailAndKey(email, verificationCode) {
	return await Vtex.customer.loginWithEmailAndAccessKey(email, verificationCode)
}

export async function sendAccessKeyByEmail(email) {
	return await Vtex.customer.sendAccessKeyByEmail(email)
}

export const doLogout = async () => {
	return await Vtex.customer.logout()
}

export const isLoggedIn = async () => {
	return await Vtex.customer.isLoggedIn()
}

export const getSavedUser = async () => {
	return await Vtex.customer.retrieveCustomerData()
}

export const sendPasswordResetCode = async userEmail => {
	return await Vtex.customer.sendAccessKeyByEmail(userEmail)
}

export const setPassword = async (email, accessKey, newPassword) => {
	return await Vtex.customer.setPassword(email, accessKey, newPassword)
}

export const getCustomerData = async () => {
	try {
		const result = await Vtex.customer.getCustomerProfile()
		const profile = result?.data?.profile
		return profile
	} catch (e) {
		console.log('getCustomerData error', e)
	}
}

export const setCustomerData = async profileData => {
	try {
		const payload = {
			firstName: profileData.firstName,
			lastName: profileData.lastName,
			email: profileData.email,
			document: profileData.document,
			homePhone: profileData.homePhone,
			gender: profileData.gender,
			birthDate: profileData.birthDate,
			corporateName: profileData.corporateName,
			corporateDocument: profileData.corporateDocument,
			businessPhone: profileData.businessPhone,
			stateRegistration: profileData.stateRegistration,
			tradeName: profileData.tradeName,
			isCorporate: profileData.isCorporate
		}
		const result = await Vtex.customer.updateCustomerProfile(payload)
		const updateProfile = result?.data?.updateProfile
		return updateProfile
	} catch (e) {
		console.log('setCustomerData error', e)
	}
}

export const getWishlist = async () => {
	const result = await Vtex.wishlist.listItems(1, 50)
	return result?.data?.viewLists?.[0]?.data || []
}

export const removeFromWishlist = async wishListItemId => {
	return await Vtex.wishlist.removeItem(wishListItemId)
}

export async function loginWithGoogle() {
	return await Vtex.customer.loginWithGoogle()
}

export async function loginWithFacebook() {
	return await Vtex.customer.loginWithFacebook()
}
