import Eitri from 'eitri-bifrost'
import { Text, View } from 'eitri-luminus'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { autocompleteSuggestions } from '../../services/ProductService'
import searchIcon from '../../assets/icons/search-normal.svg'
import { useTranslation } from 'eitri-i18n'
import { CustomButton, CustomInput } from 'shopping-vtex-template-shared'

let timeoutId

export default function SearchInput(props) {
	const { onSubmit, incomingValue, onChange } = props

	const [searchTerm, setSearchTerm] = useState(incomingValue || '')
	const [searchSuggestion, setSearchSuggestion] = useState([])

	const inputRef = useRef(null)

	const legacySearch = Vtex?.configs?.searchOptions?.legacySearch

	// useEffect(() => {
	// 	if (inputRef.current) {
	// 		console.log('inputRef', inputRef.current)
	// 		inputRef?.current?.focus()
	// 	}
	// }, [])

	useEffect(() => {
		if (incomingValue) {
			setSearchTerm(incomingValue)
		}
	}, [incomingValue])

	const debounce = (func, delay) => {
		return function (...args) {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => func.apply(this, args), delay)
		}
	}

	const fetchSuggestions = async value => {
		try {
			// if (!value) {
			// 	setSearchSuggestion([])
			// 	return
			// }
			if (typeof onChange === 'function') onChange(value)
			// const result = await autocompleteSuggestions(value)
			// setSearchSuggestion(result?.searches)
		} catch (error) {
			console.log('Entrada de pesquisa', 'Erro ao buscar sugestão', error)
		}
	}

	const handleAutocomplete = async e => {
		const value = e.target.value
		setSearchTerm(value)

		if (legacySearch) {
			return
		}

		const debouncedFetchSuggestions = debounce(fetchSuggestions, 400)
		debouncedFetchSuggestions(value)
	}

	const handleSearch = suggestion => {
		if (timeoutId) {
			clearTimeout(timeoutId)
		}
		setSearchSuggestion([])
		if (typeof onSubmit === 'function') onSubmit(suggestion)
	}

	const onBlurHandler = () => {
		setTimeout(() => {
			setSearchSuggestion([])
		}, 200)
	}

	return (
		<View className='flex-grow'>
			<View className='flex items-center rounded-full justify-between h-10 px-4 bg-neutral-100'>
				<Image
					src={searchIcon}
					width='16px'
				/>
				<TextInput
					ref={inputRef}
					autoFocus={true}
					type={'text'}
					value={searchTerm}
					onChange={value => handleAutocomplete(value)}
					onSubmit={value => handleSearch(value)}
					onBlur={onBlurHandler}
					placeholder={'Pesquisar...'}
					className='focus:outline-none !bg-transparent border-none shadow-none !p-0 m-0 max-w-[50%]'
				/>
				{searchTerm && (
					<View
						onPress={() => setSearchTerm('')}
						className='p-1 bg-neutral-900 rounded-full'>
						{/* <Icon
								iconKey='x'
								color='accent-100'
								width={16}
								height={16}
							/>  */}
					</View>
				)}
			</View>
		</View>
	)
}
