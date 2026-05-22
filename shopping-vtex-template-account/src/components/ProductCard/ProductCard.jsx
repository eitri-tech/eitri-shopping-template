import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useLocalShoppingCart } from '../../providers/LocalCart'
import { openCart, openProduct } from '../../services/NavigationService'
import { formatPrice } from '../../utils/utils'
import { App, EventBus } from 'eitri-shopping-vtex-shared'
import { ProductCardFullImage, TrackingService } from 'shopping-vtex-template-shared'

import { useCartItem, useWishlist } from './productCard.hooks'
import { getProductVideo, formatInstallments, getFormattedListPrice } from './productCard.utils'
import { useSnackBar } from '../../providers/SnackBar'
import { useTranslation } from 'eitri-i18n'

// ========== Componente Principal ==========

export default function ProductCard({ product, className }) {
	const { addItem, removeItem, updateItemQuantity, cart } = useLocalShoppingCart()
	const { showSnackBar } = useSnackBar()
	const { t } = useTranslation()

	const [loadingCartOp, setLoadingCartOp] = useState(false)

	const item = useMemo(() => {
		const availableSku = product.items.find(item =>
			item.sellers.some(seller => seller.commertialOffer?.AvailableQuantity > 0)
		)
		return availableSku || product.items[0]
	}, [product])

	const sellerDefault = useMemo(() => {
		if (!item?.sellers?.length) return null
		return item.sellers.find(seller => seller.sellerDefault) || item.sellers[0]
	}, [item])

	const isValidProduct = Boolean(item && sellerDefault)

	const itemInCart = useCartItem(cart, item?.itemId)

	const wishlist = useWishlist(product?.productId)
	const wishListIdRef = useRef(wishlist.wishListId)

	const productData = useMemo(() => {
		if (!isValidProduct) return null

		const { Price, ListPrice, spotPrice } = sellerDefault.commertialOffer

		return {
			name: product.productName,
			image: item.images?.[0]?.imageUrl || '',
			video: getProductVideo(product),
			listPrice: getFormattedListPrice(ListPrice, Math.min(Price, spotPrice)),
			discountPercentage: Math.round((1 - Math.min(Price, spotPrice) / ListPrice) * 100),
			price: formatPrice(Math.min(Price, spotPrice)),
			installments: formatInstallments(sellerDefault)
		}
	}, [product, item, sellerDefault, isValidProduct])

	const rating = null

	const itemQuantity = itemInCart?.quantity || 0

	useEffect(() => {
		wishListIdRef.current = wishlist.wishListId
	}, [wishlist.wishListId])

	useEffect(() => {
		EventBus.subscribe({
			channel: 'addToWishlist',
			broadcast: true,
			callback: data => {
				if (data?.productId === product.productId) {
					wishlist.setIsOnWishlist(true)
					wishlist.setWishListId(data?.response?.data?.addToList)
				}
			}
		})
		EventBus.subscribe({
			channel: 'removeFromWishlist',
			broadcast: true,
			callback: data => {
				if (data?.id === wishListIdRef.current && data?.response?.data?.removeFromList) {
					wishlist.setIsOnWishlist(false)
					wishlist.setWishListId(-1)
				}
			}
		})
	}, [])

	// ========== Ações do Carrinho ==========

	const handleAddToCart = useCallback(async () => {
		if (!item || loadingCartOp) return

		if (product.items.length > 1) {
			openProduct(product)
			return
		}

		await addItemToCart(item)
	}, [item, loadingCartOp, addItem])

	const addItemToCart = async (item, quantity = 1, goToCart) => {
		try {
			setLoadingCartOp(true)
			await addItem({ ...item, quantity: itemQuantity + quantity })
			TrackingService.addToCartEvent(product)
			if (goToCart) {
				openCart()
			}
			showSnackBar('success', t('productCard.addedToCart'))
		} catch (error) {
			console.error('Error adding to cart:', error)
		} finally {
			setLoadingCartOp(false)
		}
	}

	const handleRemoveFromCart = useCallback(async () => {
		if (!itemInCart || loadingCartOp) return

		try {
			setLoadingCartOp(true)
			if (itemQuantity - 1 === 0) TrackingService.removeFromCartEvent(cart, itemInCart.index)
			await updateItemQuantity(itemInCart.index, itemQuantity - 1)
			showSnackBar('trash', t('productCard.removedFromCart'))
		} catch (error) {
			console.error('Error removing from cart:', error)
		} finally {
			setLoadingCartOp(false)
		}
	}, [itemInCart, loadingCartOp, removeItem])

	// ========== Ações de Navegação ==========

	const handleCardPress = useCallback(() => {
		openProduct(product)
	}, [product])

	const handleWishlistPress = useCallback(() => {
		wishlist.toggle(item?.name, item?.itemId)
	}, [wishlist, item])

	// ========== Renderização ==========

	// Retorna null se o produto for inválido
	if (!isValidProduct || !productData) {
		return null
	}

	// Monta os parâmetros para o componente de apresentação
	const params = {
		name: productData.name,
		image: productData.image,
		video: productData.video,
		listPrice: productData.listPrice,
		showListItem: App?.configs?.appConfigs?.productCard?.showListPrice ?? true,
		rating: rating,
		price: productData.price,
		discountPercentage: productData.discountPercentage,
		installments: productData.installments,
		isInCart: Boolean(itemInCart),
		isOnWishlist: wishlist.isOnWishlist,
		loadingWishlistOp: wishlist.loading,
		loadingCartOp,
		itemQuantity,
		actionLabel: itemInCart ? t('productCard.viewCart') : t('productCard.buy'),
		onPressOnCard: handleCardPress,
		onPressRemoveItem: handleRemoveFromCart,
		onPressAddItem: handleAddToCart,
		onPressOnWishlist: handleWishlistPress,
		className
	}

	const Implementation = ProductCardFullImage

	return React.createElement(Implementation, params)
}
