import Eitri from 'eitri-bifrost'
import { BottomInset, HeaderContentWrapper, HeaderReturn, HeaderText, Loading } from 'shopping-vtex-template-shared'
import BlogBanner from '../components/CmsComponents/Blog/BlogBanner'
import BlogCard from '../components/CmsComponents/Blog/BlogCard'

export default function BlogHome(props) {
	const blogUrl = props?.history?.location?.state?.blogUrl || props?.location?.state?.blogUrl

	const [isLoading, setIsLoading] = useState(true)
	const [posts, setPosts] = useState([])
	const [isFetchingMore, setIsFetchingMore] = useState(false)
	const [postsQuantity, setPostsQuantity] = useState(5)
	const [totalPosts, setTotalPosts] = useState(null)

	useEffect(() => {
		window.scroll(0, 0)
		Eitri.navigation.setOnResumeListener(() => {
			console.log('BlogHome resumed')
		})
		Eitri.eventBus.subscribe({
			channel: 'onUserTappedActiveTab',
			callback: _ => {
				Eitri.navigation.backToTop()
			}
		})
	}, [])

	useEffect(() => {
		getPosts(postsQuantity)
	}, [postsQuantity])

	useEffect(() => {
		const handleScroll = () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 && !isFetchingMore) {
				if (totalPosts === null || posts.length < totalPosts) {
					setIsFetchingMore(true)
					setPostsQuantity(prev => prev + 3)
				}
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => window.removeEventListener('scroll', handleScroll)
	}, [isFetchingMore, posts.length, totalPosts])

	const getPosts = async postsNum => {
		try {
			const _url = `${blogUrl}/wp-json/wp/v2/posts?_embed&per_page=${postsNum}`
			const result = await Eitri.http.get(_url)

			setPosts([...result.data])

			if (totalPosts === null) {
				setTotalPosts(parseInt(result.headers['x-wp-total'], 10))
			}
		} catch (error) {
			console.error('BlogHome.getPosts', error)
		} finally {
			setIsLoading(false)
			setIsFetchingMore(false)
		}
	}

	const getPostImageUrl = post => post._embedded?.['wp:featuredmedia']?.[0]?.source_url

	const navigateToPost = postId => {
		Eitri.navigation.navigate({ path: 'BlogPost', state: { blogUrl, postId } })
	}

	return (
		<Page
			title='Blog'
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
				<View className='flex flex-col'>
					{posts
						.filter(post => !post.categories.includes(1))
						.map((post, index) => {
							const postImg = getPostImageUrl(post)

							return index < 3 ? (
								<BlogBanner
									key={post.id}
									postImg={postImg}
									post={post}
									handleClick={() => navigateToPost(post.id)}
								/>
							) : (
								<View
									key={post.id}
									className='px-4 mt-4'>
									<BlogCard
										postImg={postImg}
										post={post}
										handleClick={() => navigateToPost(post.id)}
										width='100%'
									/>
								</View>
							)
						})}

					{isFetchingMore && (
						<View className='flex flex-row justify-center py-4'>
							<Loading isLoading={true} />
						</View>
					)}
				</View>
			)}
			<BottomInset />
		</Page>
	)
}
