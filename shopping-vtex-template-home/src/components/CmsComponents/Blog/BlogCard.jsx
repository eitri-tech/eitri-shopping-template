import { useTranslation } from 'eitri-i18n'

export default function BlogCard(props) {
	const { postImg, post, handleClick, width, textWidth } = props
	const { t } = useTranslation()

	const category = post?._embedded['wp:term'][0][0].name.toUpperCase()
	const author = post?._embedded?.author[0].name
	const publishedDate = new Date(post?.date).toLocaleDateString('pt-BR')
	const publishedPrefix = t('blogCard.publishedPrefix', 'Publicado')
	const byLabel = t('blogCard.by', 'por')
	const inLabel = t('blogCard.in', 'em')

	const excerpt = post.excerpt.rendered.replace('<p>', '').replace('</p>', '')
	const isFullWidth = width === '100%'

	return (
		<View
			key={post.id}
			className={`min-h-[290px] ${isFullWidth ? 'w-full' : 'w-[283px]'}`}
			onClick={handleClick}>
			<View className='flex flex-col w-full rounded-2xl shadow-md'>
				<View className='relative'>
					<Image
						src={postImg}
						className='w-full h-[168px] rounded object-cover object-top'
						alt={post.title.rendered}
					/>
					<View className='px-2 bg-primary rounded-full absolute bottom-2 left-4 w-fit'>
						<Text className='text-white !text-[14px]'>{category}</Text>
					</View>
				</View>
				<View className='flex flex-col h-full p-4'>
					<View className='h-[48px]'>
						<Text className='line-clamp-2 font-bold'>{post.title.rendered}</Text>
					</View>

					<View>
						<Text
							className={`line-clamp-3 ${isFullWidth ? 'w-full' : `max-w-[${textWidth || '231px'}]`} text-support-01 text-sm mb-[4px] font-normal`}>
							{excerpt}
						</Text>
					</View>

					<Text className='!text-[10px] mt-auto'>
						{`${publishedPrefix} ${author ? `${byLabel} ${author} ` : ''}${inLabel} ${publishedDate}`}
					</Text>
				</View>
			</View>
		</View>
	)
}
