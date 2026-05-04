import { CustomCarousel } from 'shopping-vtex-template-shared'

export default function BannersRichText(props) {
	const { data } = props

	const contentList = data?.content ?? []

	const renderBanner = (item, index) => {
		let parsed = null

		try {
			parsed = JSON.parse(item?.contentText)
		} catch (e) {
			console.error('Error JSON parse [BannersRichText]', e)
		}

		return (
			<View
				key={`banner_text_${index}`}
				className='w-full flex gap-1 items-center justify-center px-2 snap-x snap-always bg-primary h-10'>
				{item?.imageUrlLeft && (
					<Image
						src={item.imageUrlLeft}
						className='w-[15px] h-[15px]'
					/>
				)}

				{parsed?.blocks?.map((block, i) => (
					<Text
						key={i}
						className='text-white text-xs font-medium text-center py-1.5'>
						{block.text}
					</Text>
				))}

				{item?.imageUrlRight && (
					<Image
						src={item.imageUrlRight}
						className='w-[15px] h-[15px]'
					/>
				)}
			</View>
		)
	}

	const hasMultipleBanners = contentList?.length > 1
	const hasSingleBanner = contentList?.length === 1

	return (
		<View className='w-full h-10'>
			{data?.title && <Text className='font-bold text-2xl px-4 mb-2'>{data.title}</Text>}

			{hasMultipleBanners ? (
				<CustomCarousel
					autoPlay
					loop
					interval={6000}>
					{contentList.map(renderBanner)}
				</CustomCarousel>
			) : hasSingleBanner ? (
				renderBanner(contentList[0], 0)
			) : null}
		</View>
	)
}
