import { Spacing, Divisor } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
export default function Description(props) {
	const { description } = props
	const [collapsed, setCollapsed] = useState(false)
	const [showMore, setShowMore] = useState(false)
	const isLongDescription = description?.length > 100
	const { t } = useTranslation()
	const toggleCollapsedState = () => {
		setCollapsed(!collapsed)
	}
	const toggleShowMore = () => {
		setShowMore(!showMore)
	}
	function removeTags(description) {
		const regex = /<(strong|h2)>(.*?)<\/\1>/g
		let descriptionTitle = []
		let match = ''
		while ((match = regex.exec(description)) !== null) {
			descriptionTitle.push(match[2])
		}
		const modifiedDescription = description.replace(regex, '')
		return {
			descriptionTitle,
			modifiedDescription
		}
	}
	const result = removeTags(description)
	return (
		<View className='w-full overflow-x-hidden'>
			<View onClick={() => toggleCollapsedState()}>
				<View className='flex items-center justify-between w-full'>
					<Text className='text-lg font-bold'>{t('description.txtDescription')}</Text>
					<View>{/* <Icon iconKey={collapsed ? 'chevron-down' : 'chevron-up'} width={26} /> */}</View>
				</View>
			</View>
			{!collapsed && (
				<View>
					<Text className='font-bold my-8'>{result.descriptionTitle}</Text>
					<Text>
						{showMore || !isLongDescription
							? result?.modifiedDescription
							: `${result?.modifiedDescription.substring(0, 220)}...`}
					</Text>
					{isLongDescription && (
						<View onClick={toggleShowMore}>
							<Text className='underline font-bold mt-1'>
								{showMore ? t('description.labelSeeLess') : t('description.labelSeeMore')}
							</Text>
						</View>
					)}
					<Spacing height='20px' />
				</View>
			)}
			<Divisor />
		</View>
	)
}
