import Eitri from 'eitri-bifrost'

const DEFAULT_API_URL = 'https://maps.stores.worldwidegolfshops.com/api/getAsyncLocations'

const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const formatHour = (h, m) => {
	const hour = h === 0 ? 12 : h > 12 ? h - 12 : h
	const period = h >= 12 ? 'PM' : 'AM'
	return m > 0 ? `${hour}:${String(m).padStart(2, '0')}${period}` : `${hour}${period}`
}

const parseHours = hoursData => {
	try {
		if (!hoursData) return { isOpen: null, hoursDescription: '' }

		const now = new Date()
		const currentDay = DAY_NAMES_FULL[now.getDay()]
		const currentMinutes = now.getHours() * 60 + now.getMinutes()

		// Supports both { days: { Monday: [{open,close}] } } (maplist) and { monday: '9:00-19:00' } (legacy)
		const days = hoursData.days || hoursData
		const todayData =
			days[currentDay] ||
			days[currentDay.toLowerCase()] ||
			days[currentDay.substring(0, 3)] ||
			null

		if (!todayData || todayData === 'closed') {
			return { isOpen: false, hoursDescription: 'Closed today' }
		}

		// Array format from maplist: [{ open: '09:00', close: '19:00' }]
		if (Array.isArray(todayData) && todayData.length > 0) {
			const [openH, openM] = todayData[0].open.split(':').map(Number)
			const [closeH, closeM] = todayData[0].close.split(':').map(Number)
			const openMinutes = openH * 60 + openM
			const closeMinutes = closeH * 60 + closeM
			const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes
			if (isOpen) return { isOpen: true, hoursDescription: `Open · Closes ${formatHour(closeH, closeM)}` }
			if (currentMinutes < openMinutes) return { isOpen: false, hoursDescription: `Closed · Opens ${formatHour(openH, openM)}` }
			return { isOpen: false, hoursDescription: 'Closed today' }
		}

		// Legacy string format: '9:00-19:00'
		if (typeof todayData === 'string') {
			const match = todayData.match(/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/)
			if (!match) return { isOpen: null, hoursDescription: todayData }
			const openMinutes = parseInt(match[1]) * 60 + parseInt(match[2])
			const closeMinutes = parseInt(match[3]) * 60 + parseInt(match[4])
			const isOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes
			if (isOpen) return { isOpen: true, hoursDescription: `Open · Closes ${formatHour(parseInt(match[3]), parseInt(match[4]))}` }
			if (currentMinutes < openMinutes) return { isOpen: false, hoursDescription: `Closed · Opens ${formatHour(parseInt(match[1]), parseInt(match[2]))}` }
			return { isOpen: false, hoursDescription: 'Closed today' }
		}

		return { isOpen: null, hoursDescription: '' }
	} catch {
		return { isOpen: null, hoursDescription: '' }
	}
}

// marker.info is: <div class="tlsmap_popup">{...json...}</div>
const parseInfo = info => {
	if (!info) return {}
	if (typeof info === 'object') return info
	try {
		const jsonMatch = info.match(/\{[\s\S]*\}/)
		if (jsonMatch) return JSON.parse(jsonMatch[0])
		return JSON.parse(info)
	} catch {
		return {}
	}
}

// data.maplist is: <div class="tlsmap_list">{obj1},{obj2}...</div>
// Contains richer data: local_phone, distance, hours_sets:primary, brand, location_display_name, badges_cs
const parseMapList = maplist => {
	if (!maplist) return {}
	try {
		const htmlMatch = maplist.match(/<div[^>]*>([\s\S]*)<\/div>/)
		const content = (htmlMatch ? htmlMatch[1] : maplist).trim().replace(/,\s*$/, '')
		if (!content) return {}
		const items = JSON.parse(`[${content}]`)
		const lookup = {}
		for (const item of items) {
			if (item.fid != null) lookup[String(item.fid)] = item
		}
		return lookup
	} catch {
		return {}
	}
}

const mapMarkersToStores = (markers, mapListLookup = {}) =>
	markers
		.filter(m => m.lat && m.lng)
		.map((marker, index) => {
			const info = parseInfo(marker.info)
			const fid = String(info.fid || marker.locationId || index + 1)
			const rich = mapListLookup[fid] || {}

			// Hours: prefer maplist hours_sets:primary (richer), fallback to info.hours
			let hoursInfo = { isOpen: null, hoursDescription: '' }
			try {
				const primaryHoursStr = rich['hours_sets:primary']
				if (primaryHoursStr) {
					hoursInfo = parseHours(JSON.parse(primaryHoursStr))
				} else if (info.hours) {
					hoursInfo = parseHours(info.hours)
				}
			} catch {
				hoursInfo = { isOpen: null, hoursDescription: '' }
			}

			const rawDistance = rich.distance || info.distance || marker.distance || ''
			const distance = rawDistance ? `${parseFloat(rawDistance).toFixed(1)}mi` : ''

			// Type from badges_cs (e.g. "Retail Store,Cool Clubs Indoor Tour Experience")
			const primaryBadge = rich.badges_cs?.split(',')[0]?.trim() || ''
			const specialties = info.specialties || marker.specialties || []
			const type = (primaryBadge || (specialties.length > 0 ? specialties[0] : 'Retail Store')).toUpperCase()

			// Name: use location_display_name ("Roger Dunn Golf Shops - Newbury Park")
			const name = rich.location_display_name || info.location_name || marker.tooltip || `Store ${index + 1}`
			const chainName = rich.brand || info.chain_name || ''

			return {
				id: fid,
				name,
				// Omit chainName if it's already a prefix of the display name (avoids duplication)
				chainName: chainName && !name.startsWith(chainName) ? chainName : '',
				type,
				address: [info.address_1 || rich.address_1, info.address_2 || rich.address_2].filter(Boolean).join(', '),
				city: info.city || rich.city || '',
				state: info.region || rich.region || '',
				zipCode: info.post_code || rich.post_code || '',
				latitude: parseFloat(marker.lat || info.lat),
				longitude: parseFloat(marker.lng || info.lng),
				phone: rich.local_phone || info.phone || '',
				isOpen: hoursInfo.isOpen,
				hoursDescription: hoursInfo.hoursDescription,
				distance,
				url: info.url || rich.url || '',
			}
		})

export const fetchStores = async (searchQuery = '') => {
	try {
		const config = await Eitri.environment.getRemoteConfigs().catch(() => ({}))
		const apiUrl = config?.appConfigs?.storeLocatorApiUrl || DEFAULT_API_URL

		const response = await Eitri.http.get(
			`${apiUrl}?template=search&level=search&search=${encodeURIComponent(searchQuery)}`
		)

		const data = response?.data
		if (!data?.markers || data.markers.length === 0) return []

		const mapListLookup = parseMapList(data.maplist)
		return mapMarkersToStores(data.markers, mapListLookup)
	} catch (e) {
		console.error('StoreLocatorService: fetch failed', e)
		return []
	}
}
