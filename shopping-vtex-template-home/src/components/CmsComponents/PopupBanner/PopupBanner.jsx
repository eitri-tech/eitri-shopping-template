import { Image, View } from 'eitri-luminus'
import { processActions } from '../../../services/ResolveCmsActions'

const getCampaignConfig = data => {
	const banners = Array.isArray(data?.banners) ? data.banners.filter(item => item?.imageUrl) : []
	const configuredMaxDisplays = Number(data?.maxDisplays)
	const maxDisplays = Number.isFinite(configuredMaxDisplays)
		? Math.min(Math.max(Math.trunc(configuredMaxDisplays), 0), banners.length)
		: banners.length

	return { banners, maxDisplays }
}

export default function PopupBanner({ data }) {
	const [banner, setBanner] = useState(null)

	useEffect(() => {
		const { banners, maxDisplays } = getCampaignConfig(data)

		if (data?.isActive === false || maxDisplays === 0) {
			setBanner(null)
			return
		}

		setBanner({ data: banners[0], index: 0 })
	}, [data])

	if (!banner) return null

	const showFollowingBanner = event => {
		event?.stopPropagation?.()

		const { banners, maxDisplays } = getCampaignConfig(data)
		const nextIndex = banner.index + 1

		if (nextIndex >= maxDisplays) {
			setBanner(null)
			return
		}

		setBanner({ data: banners[nextIndex], index: nextIndex })
	}

	const openBannerAction = event => {
		event?.stopPropagation?.()
		setBanner(null)
		processActions(banner.data)
	}

	return (
		<View
			className='z-[9999] !bg-black/70 !opacity-100 fixed inset-0 flex items-center justify-center px-4'
			onClick={showFollowingBanner}>
			<View
				className='relative w-full max-w-[520px] max-h-[85vh] flex items-center justify-center'
				onClick={event => event?.stopPropagation?.()}>
				<View
					className='absolute top-3 right-3 z-[10000] w-12 h-12 rounded-full bg-white flex items-center justify-center shadow'
					onClick={showFollowingBanner}>
					<svg
						width='28'
						height='28'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M18 6L6 18M6 6L18 18'
							stroke='#111111'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</View>

				<Image
					src={banner.data.imageUrl}
					alt={banner.data.altText || 'Banner promocional'}
					className={`w-full max-h-[85vh] object-contain rounded ${
						banner.data?.action?.type && banner.data.action.type !== 'none' ? 'cursor-pointer' : ''
					}`}
					onClick={
						banner.data?.action?.type && banner.data.action.type !== 'none' ? openBannerAction : undefined
					}
				/>
			</View>
		</View>
	)
}
