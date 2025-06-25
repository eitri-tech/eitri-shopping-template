import { Vtex } from 'eitri-shopping-vtex-shared'
import { crashLog } from './trackingService'

export const getCart = async () => {
	try {
		return await Vtex.cart.getCurrentOrCreateCart()
	} catch (error) {
		console.log('Erro ao buscar carrinho', error)
		crashLog('Erro ao buscar carrinho', error)
	}
}

export const addItemToCart = async item => {
	try {
		return await Vtex.cart.addItem(item)
	} catch (error) {
		console.error('Erro ao adicionar item ao carrinho', error)
		// crashLog('Erro ao adicionar item ao carrinho', error)
	}
}

export const removeCartItem = async index => {
	try {
		return await Vtex.cart.removeItem(index)
	} catch (error) {
		console.log('Erro ao remover item do carrinho', error)
		crashLog('Erro ao remover item do carrinho', error)
	}
}

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
