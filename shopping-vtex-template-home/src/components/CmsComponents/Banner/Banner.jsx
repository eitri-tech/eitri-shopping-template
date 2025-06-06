import Eitri from 'eitri-bifrost'
import {View} from "eitri-luminus";
import SliderHero from './components/SliderHero'
import BannerList from './components/BannerList'
import { openBrand, openProductById, resolveNavigation } from '../../../services/NavigationService'
import FitOnScreen from './components/FitOnScreen'
import GridList from './components/GridList'
import RoundedBannerList from './components/RoundedBannerList'
import SingleBanner from './components/SingleBanner'
export default function Banner(props) {
  const { data } = props
  const mode = data.mode
  const handleLegacySearchAction = (value, title) => {
    Eitri.navigation.navigate({
      path: 'ProductCatalog',
      state: {
        facets: value,
        title: title,
      },
    })
  }
  const handleSearchAction = (value) => {
    Eitri.navigation.navigate({
      path: 'Search',
      state: {
        searchTerm: value,
      },
    })
  }
  const handleCollectionAction = (value, title) => {
    Eitri.navigation.navigate({
      path: 'ProductCatalog',
      state: {
        facets: `productClusterIds/${value}`,
        title: title,
      },
    })
  }
  const handlePageAction = (value) => {
    Eitri.navigation.navigate({
      path: 'LandingPage',
      state: {
        landingPageName: value,
      },
    })
  }
  const handleCategoryAction = (value) => {
    resolveNavigation(value)
  }
  const handleProductAction = (value) => {
    openProductById(value)
  }
  function processActions(sliderData) {
    const action = sliderData?.action
    switch (action?.type) {
      case 'legacySearch':
        handleLegacySearchAction(action.value, action.title)
        break
      case 'search':
        handleSearchAction(action.value)
        break
      case 'collection':
        handleCollectionAction(action.value, action.title)
        break
      case 'page':
        handlePageAction(action.value)
        break
      case 'category':
        handleCategoryAction(action.value)
        break
      case 'product':
        handleProductAction(action.value)
        break
      case 'path':
        resolveNavigation(action.value)
        break
      case 'brand':
        openBrand(action.value, action.title)
        break
      default:
        console.log(`Unknown action type: ${action.type}`)
    }
  }
  if (mode === 'SliderHero') {
    return <SliderHero data={data} onClick={processActions} />
  }
  if (mode === 'BannerList') {
    return <BannerList data={data} onClick={processActions} />
  }
  if (mode === 'RoundedBannerList') {
    return <RoundedBannerList data={data} onClick={processActions} />
  }
  if (mode === 'GridList') {
    return <GridList data={data} onClick={processActions} />
  }
  if (mode === 'SingleBanner') {
    return <SingleBanner data={data} onClick={processActions} />
  }
  if (mode === 'FitOnScreen') {
    return (
      <View>
        <FitOnScreen data={data} onClick={processActions} />
      </View>
    )
  }
  return <SliderHero data={data} onClick={processActions} />
}
