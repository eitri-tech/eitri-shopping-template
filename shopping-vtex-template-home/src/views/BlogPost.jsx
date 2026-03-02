import Eitri from 'eitri-bifrost'
import { HTMLRender } from 'eitri-luminus'
import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText, Loading } from 'shopping-vtex-template-shared'

export default function BlogPost(props) {
	const postId = props?.history?.location?.state?.postId || props?.location?.state?.postId
	const blogUrl = props?.history?.location?.state?.blogUrl || props?.location?.state?.blogUrl

	const [isLoading, setIsLoading] = useState(true)
	const [blogPost, setBlogPost] = useState(null)
	const [postImage, setPostImage] = useState('')

	useEffect(() => {
		window.scroll(0, 0)
		fetchBlogPost()
		Eitri.eventBus.subscribe({
			channel: 'onUserTappedActiveTab',
			callback: _ => {
				Eitri.navigation.backToTop()
			}
		})
	}, [])

	const fetchBlogPost = async () => {
		try {
			const _url = `${blogUrl}/wp-json/wp/v2/posts/${postId}?_embed`
			const response = await Eitri.http.get(_url)
			const imageUrl = response?.data?._embedded?.['wp:featuredmedia']?.[0]?.source_url

			setBlogPost(response?.data)
			setPostImage(imageUrl)
		} catch (error) {
			console.error('BlogPost.fetchBlogPost', error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Page
			title='Blog Post'
			topInset
			bottomInset>
			<HeaderContentWrapper className='gap-4'>
				<HeaderReturn />
				<HeaderText text='Blog' />
			</HeaderContentWrapper>

			<Loading
				fullScreen
				isLoading={isLoading}
			/>

			{!isLoading && (
				<View className='flex flex-col pb-8'>
					{postImage && (
						<Image
							src={postImage}
							className='w-full h-[240px] object-cover object-top'
							alt={blogPost?.title?.rendered}
						/>
					)}
					<View className='flex flex-col gap-4 px-4 py-4'>
						<Text className='font-bold text-xl leading-snug'>{blogPost?.title?.rendered}</Text>
						<HTMLRender html={blogPost?.content?.rendered} />
					</View>
				</View>
			)}
			<BottomInset />
		</Page>
	)
}
