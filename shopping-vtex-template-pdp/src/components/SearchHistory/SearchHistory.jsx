import { deleteHistory, getSearchHistory } from '../../services/SearchMetadataService'
import { FiClock } from 'react-icons/fi'

export default function SearchHistory(props) {
	const { onSubmit, className, ...rest } = props

	const [history, setHistory] = useState([])

	useEffect(() => {
		getSearchHistory()
			.then(res => setHistory(res))
			.catch(err => {})
	}, [])

	const clearHistory = () => {
		setHistory([])
		deleteHistory()
	}

	if (!history?.length) return null

	return (
		<View
			className={`${className || ''}`}
			{...rest}>
			<View className={'flex justify-between items-center'}>
				<Text className='font-bold text-sm'>histórico</Text>
				<View
					onClick={clearHistory}
					className={'text-sm text-gray-600'}>
					limpar histórico
				</View>
			</View>
			<View className='mt-4 flex flex-col gap-3'>
				{history.map(term => (
					<View
						className='flex items-center justify-between'
						onClick={() => onSubmit(term)}>
						<View className='flex items-center gap-2'>
							<FiClock
								className={'text-primary'}
								size={20}
							/>
							<Text className='text'>{term}</Text>
						</View>
					</View>
				))}
			</View>
		</View>
	)
}
