import { Vtex } from 'eitri-shopping-vtex-shared'
import adaptCart from '../adapters/CartAdapter'

export const getCart = async () => {
	try {
		return await Vtex.cart.getCurrentOrCreateCart()
	} catch (error) {
		console.log('Erro ao buscar carrinho', error)
	}
}

export const addItemToCart = async payload => {
	try {
		return await Vtex.checkout.addItem(payload)
	} catch (error) {
		console.log('Erro ao adicionar item ao carrinho', error)
	}
}

export const saveCartIdOnStorage = async orderFormId => {
	return await Vtex.cart.saveCartIdOnStorage(orderFormId)
}

export const addItemOffer = async (itemIndex, offeringId) => {
	return await Vtex.cart.addOfferingsItems(itemIndex, offeringId)
}

export const removeItemOffer = async (itemIndex, offeringId) => {
	return await Vtex.cart.removeOfferingsItems(itemIndex, offeringId)
}

export const addOpenTextFieldToCart = async value => {
	return await Vtex.cart.addOpenTextFieldToCart(value)
}

export const changeItemQuantity = async (index, newQuantity) => {
	try {
		return await Vtex.cart.changeItemQuantity(index, newQuantity)
	} catch (error) {
		console.log('Erro ao adicionar item ao carrinho', error)
	}
}

export const removeCartItem = async index => {
	try {
		return await Vtex.cart.removeItem(index)
	} catch (error) {
		console.log('Erro ao remover item do carrinho', error)
	}
}

export const addCoupon = async coupon => {
	return await Vtex.checkout.addPromoCode(coupon)
}

export const removeCoupon = async () => {
	return await Vtex.checkout.addPromoCode('')
}
