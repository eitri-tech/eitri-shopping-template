export default function BlogBanner(props) {
	const { postImg, post, handleClick } = props

	const category = post?._embedded?.['wp:term']?.[0]?.[0]?.name?.toUpperCase()
	const publishedDate = new Date(post?.date).toLocaleDateString('pt-BR')

	return (
		<View
			className='relative w-full h-[220px] overflow-hidden'
			onClick={handleClick}>
			<Image
				src={postImg}
				className='w-full h-full object-cover object-top'
				alt={post?.title?.rendered}
			/>
			<View className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent' />
			<View className='absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-1'>
				{category && (
					<View className='px-2 py-[2px] bg-primary rounded-full w-fit'>
						<Text className='text-white !text-[12px] font-semibold'>{category}</Text>
					</View>
				)}
				<Text className='text-white font-bold text-base line-clamp-2'>{post?.title?.rendered}</Text>
				<Text className='text-white/70 !text-[11px]'>{publishedDate}</Text>
			</View>
		</View>
	)
}
