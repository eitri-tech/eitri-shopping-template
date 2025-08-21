import { Divisor } from 'eitri-shopping-montreal-shared'
import Rating from '../Rating/Rating'
import { useTranslation } from 'eitri-i18n'
export default function Review(props) {
	const { review } = props
	const { t } = useTranslation()
	return (
		<View>
			<View className='py-2'>
				<Text className='text-base font-bold'>{review?.user?.name}</Text>
				<View className='flex items-center justify-between pt-1'>
					<Rating ratingValue={review?.rate} />
					<Text className='text-neutral-content font-bold'>{review?.created_at}</Text>
				</View>
				<View className='py-1'>
					<Text>{review?.opinion || t('review.txtOpnion')}</Text>
				</View>
			</View>
			<Divisor />
		</View>
	)
}
