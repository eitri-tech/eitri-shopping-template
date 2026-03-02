import { useState, useEffect } from 'react'
import Eitri from 'eitri-bifrost'
import { HeaderContentWrapper, HeaderReturn, HeaderText, BottomInset, Loading, CustomInput } from 'shopping-vtex-template-shared'
import GoogleMapReact from 'google-map-react'
import {
	HiMagnifyingGlass,
	HiPhone,
	HiMapPin,
	HiStar,
	HiBuildingStorefront,
	HiXMark,
	HiClock,
	HiArrowTopRightOnSquare,
} from 'react-icons/hi2'
import { fetchStores } from '../services/StoreLocatorService'

const TAB_LIST = 'list'
const TAB_MAP = 'map'

// ─── Map Marker ──────────────────────────────────────────────────────────────

const MapMarker = ({ store, isSelected }) => (
	<View
		style={{ transform: 'translate(-50%, -100%)' }}
		className='flex flex-col items-center cursor-pointer'
	>
		<View
			className={`flex items-center justify-center rounded-full border-2 border-white shadow-lg transition-all ${
				isSelected ? 'w-12 h-12 bg-red-600' : 'w-9 h-9 bg-green-900'
			}`}
		>
			<HiMapPin className='text-white w-5 h-5' />
		</View>
		{isSelected && store?.name ? (
			<View className='mt-1 bg-white rounded-lg px-2 py-1 shadow-md'>
				<Text className='text-green-900 text-xs font-bold whitespace-nowrap'>{store.name}</Text>
			</View>
		) : null}
	</View>
)

// ─── Store Card ───────────────────────────────────────────────────────────────

const StoreCard = ({ store, index, isFavorite, onSetFavorite }) => {
	const handleCall = () => {
		if (!store.phone) return
		Eitri.openBrowser({ url: `tel:${store.phone.replace(/\D/g, '')}` })
	}

	const handleDirections = () => {
		const query = encodeURIComponent(
			[store.address, store.city, store.state, store.zipCode].filter(Boolean).join(', ')
		)
		Eitri.openBrowser({ url: `https://www.google.com/maps/search/?api=1&query=${query}` })
	}

	return (
		<View className='bg-white border-b-8 border-gray-100'>
			<View className='px-4 pt-4 pb-5'>
				{/* Header: number + name + distance */}
				<View className='flex flex-row items-start justify-between mb-2'>
					<View className='flex flex-row items-center gap-3 flex-1 mr-2'>
						<View className='w-8 h-8 rounded-full bg-green-900 flex items-center justify-center flex-shrink-0'>
							<Text className='text-white text-xs font-bold'>{index + 1}</Text>
						</View>
						<View className='flex-1'>
							<Text className='text-green-900 font-bold text-base leading-snug'>{store.name}</Text>
							{store.chainName ? (
								<Text className='text-gray-500 text-sm'>{store.chainName}</Text>
							) : null}
						</View>
					</View>
					{store.distance ? (
						<Text className='text-gray-500 text-sm font-medium flex-shrink-0'>{store.distance}</Text>
					) : null}
				</View>

				{/* Type badge */}
				<View className='mb-3'>
					<View className='self-start inline-flex bg-green-900 rounded-full px-3 py-1'>
						<Text className='text-white text-xs font-bold tracking-wider'>{store.type}</Text>
					</View>
				</View>

				{/* Address */}
				<View className='mb-2'>
					{store.address ? (
						<Text className='text-gray-800 text-sm'>{store.address}</Text>
					) : null}
					{store.city || store.state ? (
						<Text className='text-gray-800 text-sm'>
							{[store.city, store.state, store.zipCode].filter(Boolean).join(', ')}
						</Text>
					) : null}
				</View>

				{/* Hours */}
				{store.hoursDescription ? (
					<View className='flex flex-row items-center gap-2 mb-3'>
						<HiClock className='text-gray-500 w-4 h-4 flex-shrink-0' />
						<Text
							className={`text-sm font-semibold ${store.isOpen ? 'text-gray-800' : 'text-red-600'}`}
						>
							{store.isOpen ? (
								<Text className='text-green-700 font-bold'>Open</Text>
							) : (
								<Text className='text-red-600 font-bold'>Closed</Text>
							)}
							{' · '}
							{store.hoursDescription.replace(/^(Open|Closed) · /, '')}
						</Text>
					</View>
				) : null}

				{/* Set as My Store */}
				<View
					className='flex flex-row items-center gap-2 mb-4'
					onClick={() => onSetFavorite(store.id)}
				>
					<HiStar
						className={`w-5 h-5 ${isFavorite ? 'text-yellow-500' : 'text-gray-300'}`}
					/>
					<Text className='text-sm text-gray-600'>
						{isFavorite ? 'My Store' : 'Set as My Store'}
					</Text>
				</View>

				{/* Actions */}
				<View className='flex flex-row items-center gap-6'>
					{store.phone ? (
						<View className='flex flex-row items-center gap-2' onClick={handleCall}>
							<HiPhone className='text-green-700 w-5 h-5' />
							<Text className='text-green-700 text-sm font-medium'>{store.phone}</Text>
						</View>
					) : null}
					<View className='flex flex-row items-center gap-2' onClick={handleDirections}>
						<HiMapPin className='text-green-700 w-4 h-4' />
						<Text className='text-green-700 text-sm font-medium'>Directions</Text>
					</View>
				</View>
			</View>
		</View>
	)
}

// ─── Map Bottom Sheet ─────────────────────────────────────────────────────────

const StoreBottomSheet = ({ store, onClose }) => {
	if (!store) return null

	const handleCall = () => {
		if (!store.phone) return
		Eitri.openBrowser({ url: `tel:${store.phone.replace(/\D/g, '')}` })
	}

	const handleDirections = () => {
		const query = encodeURIComponent(
			[store.address, store.city, store.state].filter(Boolean).join(', ')
		)
		Eitri.openBrowser({ url: `https://www.google.com/maps/search/?api=1&query=${query}` })
	}

	return (
		<View className='absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50'>
			{/* Drag handle */}
			<View className='flex items-center pt-3 pb-1'>
				<View className='w-10 h-1 rounded-full bg-gray-300' />
			</View>

			<View className='flex flex-row justify-between items-start px-4 pt-2 pb-3 border-b border-gray-100'>
				<View className='flex-1 mr-3'>
					<Text className='text-green-900 font-bold text-base leading-snug'>{store.name}</Text>
					{store.chainName ? (
						<Text className='text-gray-500 text-sm'>{store.chainName}</Text>
					) : null}
					{store.address ? (
						<Text className='text-gray-700 text-sm mt-1'>{store.address}</Text>
					) : null}
					{store.city ? (
						<Text className='text-gray-700 text-sm'>
							{[store.city, store.state, store.zipCode].filter(Boolean).join(', ')}
						</Text>
					) : null}
					{store.hoursDescription ? (
						<Text
							className={`text-sm font-semibold mt-1 ${store.isOpen ? 'text-green-700' : 'text-red-600'}`}
						>
							{store.hoursDescription}
						</Text>
					) : null}
				</View>
				<View className='p-1' onClick={onClose}>
					<HiXMark className='text-gray-400 w-5 h-5' />
				</View>
			</View>

			<View className='flex flex-row gap-3 p-4'>
				{store.phone ? (
					<View
						className='flex-1 flex flex-row items-center justify-center gap-2 border-2 border-green-900 rounded-xl py-3'
						onClick={handleCall}
					>
						<HiPhone className='text-green-900 w-4 h-4' />
						<Text className='text-green-900 text-sm font-bold'>Call</Text>
					</View>
				) : null}
				<View
					className='flex-1 flex flex-row items-center justify-center gap-2 bg-green-900 rounded-xl py-3'
					onClick={handleDirections}
				>
					<HiArrowTopRightOnSquare className='text-white w-4 h-4' />
					<Text className='text-white text-sm font-bold'>Directions</Text>
				</View>
			</View>
		</View>
	)
}

// ─── Empty State ─────────────────────────────────────────────────────────────

const EmptyState = ({ hasQuery }) => (
	<View className='flex flex-col items-center justify-center py-20 px-8 gap-4'>
		<View className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center'>
			<HiBuildingStorefront className='text-gray-400 w-10 h-10' />
		</View>
		<Text className='text-gray-700 text-base font-semibold text-center'>
			{hasQuery ? 'No stores found' : 'Find a store near you'}
		</Text>
		<Text className='text-gray-400 text-sm text-center'>
			{hasQuery
				? 'Try searching for a different city or zip code.'
				: 'Type a city, state, or zip code above to search.'}
		</Text>
	</View>
)

// ─── Main View ───────────────────────────────────────────────────────────────

export default function StoreLocator() {
	const [activeTab, setActiveTab] = useState(TAB_LIST)
	const [searchInput, setSearchInput] = useState('')
	const [submittedQuery, setSubmittedQuery] = useState('')
	const [stores, setStores] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [selectedStore, setSelectedStore] = useState(null)
	const [favoriteStoreId, setFavoriteStoreId] = useState(null)
	const [mapCenter, setMapCenter] = useState({ lat: 34.1805, lng: -118.907 })
	const [googleMapsApiKey, setGoogleMapsApiKey] = useState('')
	const [mapZoom] = useState(10)

	useEffect(() => {
		loadConfig()
	}, [])

	// Auto-search while typing (debounced, min 3 chars)
	useEffect(() => {
		const q = searchInput.trim()
		if (q.length < 3) return
		const timer = setTimeout(() => {
			setSubmittedQuery(q)
			loadStores(q)
		}, 600)
		return () => clearTimeout(timer)
	}, [searchInput])

	const loadConfig = async () => {
		try {
			const [config, favId] = await Promise.all([
				Eitri.environment.getRemoteConfigs().catch(() => ({})),
				Eitri.sharedStorage.getItem('favStoreId').catch(() => null),
			])
			setGoogleMapsApiKey(config?.appConfigs?.googleMapsApiKey || '')
			if (favId) setFavoriteStoreId(favId)
			// Load initial results if operator configured a default query
			const defaultQuery = config?.appConfigs?.storeLocatorDefaultQuery || ''
			if (defaultQuery) {
				setSearchInput(defaultQuery)
				setSubmittedQuery(defaultQuery)
				loadStores(defaultQuery)
			}
		} catch (e) {
			console.error('StoreLocator: config error', e)
		}
	}

	const loadStores = async query => {
		setIsLoading(true)
		setSelectedStore(null)
		try {
			const results = await fetchStores(query)
			setStores(results)
			if (results.length > 0 && results[0].latitude && results[0].longitude) {
				setMapCenter({ lat: results[0].latitude, lng: results[0].longitude })
			}
		} catch (e) {
			console.error('StoreLocator search error:', e)
			setStores([])
		} finally {
			setIsLoading(false)
		}
	}

	const handleSearch = () => {
		const query = searchInput.trim()
		setSubmittedQuery(query)
		if (!query) {
			setStores([])
			return
		}
		loadStores(query)
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter') handleSearch()
	}

	const handleClearSearch = () => {
		setSearchInput('')
		setSubmittedQuery('')
		setStores([])
		setSelectedStore(null)
	}

	const handleSetFavorite = async storeId => {
		const newFav = favoriteStoreId === storeId ? null : storeId
		setFavoriteStoreId(newFav)
		try {
			if (newFav) {
				await Eitri.sharedStorage.setItem('favStoreId', newFav)
			} else {
				await Eitri.sharedStorage.removeItem('favStoreId')
			}
		} catch (e) {
			console.error('StoreLocator: save favorite error', e)
		}
	}

	const handleMarkerClick = store => {
		setSelectedStore(store)
		setMapCenter({ lat: store.latitude, lng: store.longitude })
	}

	const hasResults = stores.length > 0

	return (
		<Page>
			<HeaderContentWrapper>
				<HeaderReturn />
				<HeaderText text='Find a Store' />
			</HeaderContentWrapper>

			{/* ── Tab Bar ── rendered first, sticky at top of remaining space via flex column below */}
			<View className='flex flex-row border-b border-gray-200'>
				<View
					className={`flex-1 flex items-center justify-center py-3 border-b-2 ${
						activeTab === TAB_LIST
							? 'border-green-900 bg-white'
							: 'border-transparent bg-gray-50'
					}`}
					onClick={() => setActiveTab(TAB_LIST)}
				>
					<Text
						className={`text-sm font-bold ${
							activeTab === TAB_LIST ? 'text-green-900' : 'text-gray-400'
						}`}
					>
						List
					</Text>
				</View>
				<View
					className={`flex-1 flex items-center justify-center py-3 border-b-2 ${
						activeTab === TAB_MAP
							? 'border-green-900 bg-white'
							: 'border-transparent bg-gray-50'
					}`}
					onClick={() => setActiveTab(TAB_MAP)}
				>
					<Text
						className={`text-sm font-bold ${
							activeTab === TAB_MAP ? 'text-green-900' : 'text-gray-400'
						}`}
					>
						Map
					</Text>
				</View>
			</View>

			{/* ── Search Bar ── */}
			<View className='px-4 py-3 bg-white border-b border-gray-200'>
				<View className='flex flex-row items-center bg-gray-100 rounded-xl px-3 py-2.5 gap-2'>
					<HiMapPin className='text-gray-400 w-5 h-5 flex-shrink-0' />
					<View className='flex-1'>
						<CustomInput
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder='Search by City, State, or Zip'
							className='bg-transparent text-gray-800 text-sm px-0 py-0'
							style={{ border: 'none', background: 'transparent', outline: 'none' }}
						/>
					</View>
					{searchInput ? (
						<View onClick={handleClearSearch} className='p-1'>
							<HiXMark className='text-gray-400 w-4 h-4' />
						</View>
					) : null}
					<View
						className='bg-green-900 rounded-lg p-1.5'
						onClick={handleSearch}
					>
						<HiMagnifyingGlass className='text-white w-4 h-4' />
					</View>
				</View>
			</View>

			{/* ── Loading ── */}
			<Loading isLoading={isLoading} fullScreen />

			{/* ── Content ── */}
			{!isLoading && (
				<>
					{/* List Tab */}
					{activeTab === TAB_LIST && (
						<View>
							{hasResults ? (
								<>
									<View className='px-4 py-2 bg-gray-50 border-b border-gray-200'>
										<Text className='text-gray-500 text-xs font-medium uppercase tracking-wider'>
											{stores.length} {stores.length === 1 ? 'Store' : 'Stores'} found
										</Text>
									</View>
									{stores.map((store, index) => (
										<StoreCard
											key={store.id}
											store={store}
											index={index}
											isFavorite={favoriteStoreId === store.id}
											onSetFavorite={handleSetFavorite}
										/>
									))}
									<BottomInset />
								</>
							) : (
								<EmptyState hasQuery={!!submittedQuery} />
							)}
						</View>
					)}

					{/* Map Tab */}
					{activeTab === TAB_MAP && (
						<View
							className='relative'
							style={{ height: 'calc(100vh - 200px)' }}
						>
							{googleMapsApiKey ? (
								<>
									<GoogleMapReact
										bootstrapURLKeys={{ key: googleMapsApiKey }}
										center={mapCenter}
										zoom={mapZoom}
										style={{ height: '100%', width: '100%' }}
										onChildClick={(key, childProps) => {
											if (childProps?.store) handleMarkerClick(childProps.store)
										}}
										onClick={() => setSelectedStore(null)}
									>
										{stores
											.filter(s => s.latitude && s.longitude)
											.map(store => (
												<MapMarker
													key={store.id}
													lat={store.latitude}
													lng={store.longitude}
													store={store}
													isSelected={selectedStore?.id === store.id}
												/>
											))}
									</GoogleMapReact>

									{!hasResults && (
										<View className='absolute inset-0 flex items-center justify-center pointer-events-none'>
											<View className='bg-white rounded-2xl shadow-lg px-6 py-4 mx-6 text-center'>
												<HiMapPin className='text-gray-300 w-10 h-10 mx-auto mb-2' />
												<Text className='text-gray-600 text-sm font-medium'>
													Search for a city to see stores on the map
												</Text>
											</View>
										</View>
									)}

									<StoreBottomSheet
										store={selectedStore}
										onClose={() => setSelectedStore(null)}
									/>
								</>
							) : (
								<View className='flex flex-col items-center justify-center h-full gap-4 px-8 bg-gray-50'>
									<HiMapPin className='text-gray-300 w-16 h-16' />
									<Text className='text-gray-600 text-base font-semibold text-center'>
										Map unavailable
									</Text>
									<Text className='text-gray-400 text-sm text-center'>
										Configure a Google Maps API key in{' '}
										<Text className='font-mono text-xs bg-gray-200 rounded px-1'>
											appConfigs.googleMapsApiKey
										</Text>
									</Text>
								</View>
							)}
						</View>
					)}
				</>
			)}

			<BottomInset />
		</Page>
	)
}
