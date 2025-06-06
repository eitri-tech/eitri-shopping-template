import HeaderLogo from './HeaderLogo'
import HeaderComponent from './HeaderComponent'
import Eitri from 'eitri-bifrost'
import HeaderCart from './HeaderCart'
import HeaderSearch from './HeaderSearch'
import HeaderReturn from './HeaderReturn'
import HeaderText from './HeaderText'
import HeaderSearchIcon from './HeaderSearchIcon'
import HeaderShare from './HeaderShare'
import HeaderFilter from './HeaderFilter'
import { HEADER_TYPE } from 'shopping-vtex-template-shared'
import { View} from "eitri-luminus";

export default function HeaderTemplate(props) {
	const {
		headerType,
		showSearchBar,
		quantityOfItems,
		navigateToSearch,
		navigateToCart,
		scrollEffect,
		contentText,
		viewBackButton,
		filterFacets,
		handleFilterModal,
		handleShare,
		labelSearch,
		facetsModalReady,
		hasFilters,
		logo,
		children
	} = props

	const [backgroundColor, setBackgroundColor] = useState('')
	const [contentColor, setContentColor] = useState('')
	const [urlLogo, setUrlLogo] = useState('')

	useEffect(() => {
		getConfigs()
	}, [])

	const getConfigs = async () => {
		try {
			const remoteConfig = await Eitri.environment.getRemoteConfigs()
			const appConfigs = remoteConfig?.appConfigs || {}

			setBackgroundColor(appConfigs.headerBackgroundColor || 'primary-700')
			setContentColor(appConfigs.headerContentColor || 'secondary-700')

			if (appConfigs.headerLogo) {
				setUrlLogo(appConfigs.headerLogo)
			}
		} catch (error) {
			console.error('Erro ao obter configurações remotas:', error)
		}
	}

	return (
		<HeaderComponent
			backgroundColor={backgroundColor}
			contentColor={contentColor}
			filterOptions={filterFacets}
			iconCartColor={contentColor}
			showSearchBar={showSearchBar}
			scrollEffect={scrollEffect}
			handleFilterModal={handleFilterModal}
			headerType={headerType}
		>
			{headerType === HEADER_TYPE.LOGO_SEARCH_AND_CART && (
				<>
					<HeaderLogo
						src={logo || urlLogo}
						height={40}
					/>
					<View
					 className="flex flex-row h-[50px] items-center gap-2 bg-primary-100"
						>
						<HeaderSearchIcon
							navigateToSearch={navigateToSearch}
							iconColor={contentColor}
						/>
						<HeaderCart
							backgroundColor={backgroundColor}
							quantityOfItems={quantityOfItems}
							onPress={navigateToCart}
							textColor={backgroundColor}
							iconColor={contentColor}
						/>
					</View>
				</>
			)}
			{headerType === HEADER_TYPE.RETURN_SEARCH_AND_CART && (
				<>
					<HeaderReturn
						backgroundColor={backgroundColor}
						iconColor={contentColor}
					/>
					<HeaderSearch
						labelSearch={labelSearch}
						onPress={navigateToSearch}
					/>
					<HeaderCart
						width={'20%'}
						backgroundColor={backgroundColor}
						quantityOfItems={quantityOfItems}
						onPress={navigateToCart}
						textColor={backgroundColor}
						iconColor={contentColor}
					/>
				</>
			)}
			{headerType === HEADER_TYPE.TEXT_AND_SEARCH_ICON && (
				<>
					<HeaderText
						text={contentText}
						contentColor={contentColor}
					/>
					<HeaderSearchIcon
						iconColor={contentColor}
						navigateToSearch={navigateToSearch}
					/>
				</>
			)}
			{headerType === HEADER_TYPE.SEARCH_AND_CART && (
				<>
					<HeaderSearch
						labelSearch={labelSearch}
						onPress={navigateToSearch}
					/>
					<HeaderCart
						backgroundColor={backgroundColor}
						quantityOfItems={quantityOfItems}
						onPress={navigateToCart}
						textColor={backgroundColor}
						iconColor={contentColor}
					/>
				</>
			)}
			{headerType === HEADER_TYPE.RETURN_TEXT_FILTER_AND_SEARCH_ICON && (
				<>
					{viewBackButton && (
						<HeaderReturn
							backgroundColor={backgroundColor}
							iconColor={contentColor}
						/>
					)}
					<HeaderText
						contentColor={contentColor}
						text={contentText}
					/>
					<View
						// display='flex'
						// gap={16}
						className="flex gap-4"
					>
            <HeaderFilter
              iconColor={contentColor}
              handleFilterModal={handleFilterModal}
              facetsModalReady={facetsModalReady}
              hasFilters={hasFilters}
            />
						<HeaderSearchIcon
							iconColor={contentColor}
							navigateToSearch={navigateToSearch}
						/>
					</View>
				</>
			)}
			{headerType === HEADER_TYPE.SEARCH_INPUT_AND_FILTER && (
				<>
					{children}
          <HeaderFilter
            iconColor={contentColor}
            handleFilterModal={handleFilterModal}
            facetsModalReady={facetsModalReady}
            hasFilters={hasFilters}
          />
				</>
			)}
			{headerType === HEADER_TYPE.RETURN_SHARE_AND_CART && (
				<>
					<HeaderReturn
						iconColor={contentColor}
						backgroundColor={backgroundColor}
					/>
					<View
						// display='flex'
						// gap={16}
						className="flex flex-row h-[50px] items-center gap-2 bg-primary-100"
					>
						<HeaderShare
							iconColor={contentColor}
							handleShare={handleShare}
						/>
						<HeaderCart
							backgroundColor={backgroundColor}
							quantityOfItems={quantityOfItems}
							onPress={navigateToCart}
							textColor={backgroundColor}
							iconColor={contentColor}
						/>
					</View>
				</>
			)}
			{headerType === HEADER_TYPE.TEXT && (
				<>
					<HeaderText
						contentColor={contentColor}
						text={contentText}
					/>
				</>
			)}
			{headerType === HEADER_TYPE.RETURN_AND_TEXT && (
				<>
					<HeaderReturn
						iconColor={contentColor}
						backgroundColor={backgroundColor}
					/>

					<HeaderText
						contentColor={contentColor}
						text={contentText}
					/>
					<View width={'20%'}></View>
				</>
			)}
		</HeaderComponent>
	)
}
