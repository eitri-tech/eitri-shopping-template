import { Vtex } from 'eitri-shopping-vtex-shared'
import adaptCart from '../adapters/CartAdapter'

const resolveCustomizedOptions = item => {
	let hasCustomizeOption = false
	let assemblies = []

	if (
		Array.isArray(item.attachmentOfferings) &&
		item.attachmentOfferings.length > 0 &&
		item.attachmentOfferings.some(attachment => attachment.name.indexOf('etiquetas') > -1)
	) {
		hasCustomizeOption = true

		const attachments = item.attachments

		const attachmentsOfferingEtiquetas = item.attachmentOfferings.filter(
			attachment => attachment.name.indexOf('etiquetas') > -1
		)

		assemblies = attachmentsOfferingEtiquetas?.map(attachmentOffering => {
			const attachment = attachments?.find(attachment => attachment.name === attachmentOffering.name)

			return {
				required: attachmentOffering?.required,
				name: attachmentOffering?.name,
				inputValues: Object.keys(attachmentOffering.schema).map(key => {
					return {
						id: key,
						maximumNumberOfCharacters: attachmentOffering?.schema[key].maxLength,
						value: attachment ? attachment?.content[key] : ''
					}
				}),
				isAlreadyCustomized: attachment?.content
					? Object.keys(attachmentOffering.schema).every(key => attachment?.content[key])
					: false
			}
		})
	}

	let alreadyCustomized = assemblies?.every(assembly => assembly.isAlreadyCustomized)

	return {
		hasCustomizeOption: hasCustomizeOption,
		alreadyCustomized: alreadyCustomized,
		customizations: assemblies
	}
}

export const cardAdaptation = cart => {
	const formattedCart = adaptCart(cart)
	return {
		...formattedCart,
		items: formattedCart.items.map(item => ({
			...item,
			...resolveCustomizedOptions(item)
		}))
	}
}

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

