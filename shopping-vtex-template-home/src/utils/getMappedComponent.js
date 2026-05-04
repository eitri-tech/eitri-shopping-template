import Banner from '../components/CmsComponents/Banner/Banner'
import BannersRichText from '../components/CmsComponents/BannersRichText/BannersRichText'
import BlogPostShelf from '../components/CmsComponents/Blog/BlogPostShelf'
import CategoryListSwipe from '../components/CmsComponents/CategoryListSwipe/CategoryListSwipe'
import CategoryTree from '../components/CmsComponents/CategoryTree/CategoryTree'
import HighlightedProductShelf from '../components/CmsComponents/HighlightedProductShelf/HighlightedProductShelf'
import LastSeenProducts from '../components/CmsComponents/LastSeenProducts/LastSeenProducts'
import ProductInfiniteScroll from '../components/CmsComponents/ProductInfiniteScroll/ProductInfiniteScroll'
import ProductShelf from '../components/CmsComponents/ProductShelf/ProductShelf'
import ProductTiles from '../components/CmsComponents/ProductTiles/ProductTiles'

const componentMap = {
	MultipleImageBanner: Banner,
	ProductTiles: ProductTiles,
	ProductShelf: ProductShelf,
	CategoryTree: CategoryTree,
	LastSeenProducts: LastSeenProducts,
	CategoryListSwipe: CategoryListSwipe,
	ProductInfiniteScroll: ProductInfiniteScroll,
	WordPressCardList: BlogPostShelf,
	HighlightedProductShelf: HighlightedProductShelf,
	BannersRichText: BannersRichText
}

const shouldReloadOnResume = componentName => {
	const componentsToReload = ['LastSeenProducts']

	return componentsToReload.includes(componentName)
}

export const getMappedComponent = (content, reloadKey) => {
	const Component = componentMap[content.name]

	if (!Component) {
		console.error(`Component ${content.name} does not exist in the component map.`)

		return null
	}

	const key = content.id + (shouldReloadOnResume(content.name) ? reloadKey : '')

	try {
		return (
			<Component
				key={key}
				data={content.data}
			/>
		)
	} catch (error) {
		console.error(`Error rendering component ${content.name}:`, error)

		return null
	}
}
