export default function BlogCard(props) {
	const { postImg, post, handleClick, width, textWidth, imgHeight } = props

	const category = post?._embedded['wp:term'][0][0].name.toUpperCase()
	const author = post?._embedded?.author[0].name
	const publishedDate = new Date(post?.date).toLocaleDateString('pt-BR')

    const excerpt = post.excerpt.rendered.replace("<p>", "").replace("</p>", "")
	return (
		<View
			key={post.id}
			className={`mb-6 min-h-[290px] ${width ? `w-[${width}px]` : "w-[283px]"}`}
			onClick={handleClick}>
			<View className="flex flex-col w-full rounded-2xl shadow-lg">
				<View className="relative">
					<View className="min-h-[150px]">
						<Image
							src={postImg}
							className={`w-full ${imgHeight ? "" : "h-[168px]"} rounded-t-2xl`}
							alt={post.title.rendered}
						/>
					</View>
					<View className="px-2 bg-blue-500 rounded-full absolute bottom-2 left-4 w-fit">
						<Text className="text-white !text-[14px]">
							{category}
						</Text>
					</View>
				</View>
				<View className="flex flex-col h-full p-4">
					<Text className="my-[4px] mb-[4px] !text-[12px] font-bold leading-tight">
						{post.title.rendered}
					</Text>

					<Text className={`line-clamp-3 max-w-[${textWidth || '231px'}] text-support-01 text-xs mb-[4px] font-normal`}>
						{excerpt}
					</Text>
					<Text className="!text-[10px] mt-auto">{`Publicado ${author ? `por ${author}` : ''} em ${publishedDate}`}</Text>
				</View>
			</View>
		</View>
	)
}
