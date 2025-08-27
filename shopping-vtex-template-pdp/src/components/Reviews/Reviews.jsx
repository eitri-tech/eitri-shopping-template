import { Divisor, Loading, Spacing } from 'shopping-vtex-template-shared'
import Review from './Review'
import { useTranslation } from 'eitri-i18n'
export default function Reviews(props) {
	const { reviews, disableReviewButton, ratingsCount, fetchAndSetReviews, productId, productLinkText } = props
	const [collapsed, setCollapsed] = useState(false)
	const [buttomIsLoading, setButtomIsLoading] = useState(false)
	const [page, setPage] = useState(1)
	const { t } = useTranslation()
	const toggleCollapsedState = () => {
		setCollapsed(!collapsed)
	}
	const setReviews = async () => {
		setButtomIsLoading(true)
		await fetchAndSetReviews(page + 1, productId, productLinkText)
		setPage(page + 1)
		setButtomIsLoading(false)
	}
	if (!reviews) return null
	return (
		<View>
			<View onClick={() => toggleCollapsedState()}>
				<View className='flex items-center justify-between w-full'>
					<Text className='text-lg font-bold'>{`Avaliações (${ratingsCount})`}</Text>
					<View>{/* <Icon iconKey={collapsed ? 'chevron-down' : 'chevron-up'} width={26} /> */}</View>
				</View>
			</View>
			{!collapsed && (
				<View>
					{reviews?.items.map((review, index) => (
						<Review
							key={index}
							review={review}
						/>
					))}
					{!disableReviewButton && (
						<View className='py-2'>
							<View onClick={() => setReviews()}>
								<View className='flex h-40 w-50vw bg-accent border border-primary-content justify-center items-center'>
									{buttomIsLoading ? (
										<Loading />
									) : (
										<Text className='font-bold text-primary-content'>
											{t('review.seeMoreReviews')}
										</Text>
									)}
								</View>
							</View>
							<Spacing height={'10px'} />
							<Divisor />
						</View>
					)}
				</View>
			)}
		</View>
	)
}
