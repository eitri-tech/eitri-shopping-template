import Eitri from 'eitri-bifrost'
import { Text, View } from 'eitri-luminus'
import { Vtex } from 'eitri-shopping-vtex-shared'
import { autocompleteSuggestions } from '../../services/ProductService'
import searchIcon from '../../assets/icons/search-normal.svg'
import { useTranslation } from 'eitri-i18n'
import { CustomButton, CustomInput } from 'shopping-vtex-template-shared'

let timeoutId
export default function SearchInput(props) {
	const { onSubmit, incomingValue } = props
	const [searchTerm, setSearchTerm] = useState(incomingValue || '')
	const [searchSuggestion, setSearchSuggestion] = useState([])
	const legacySearch = Vtex?.configs?.searchOptions?.legacySearch
	const { t } = useTranslation()

	const debounce = (func, delay) => {
		return function (...args) {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => func.apply(this, args), delay)
		}
	}

	const fetchSuggestions = async value => {
		try {
			if (!value) {
				setSearchSuggestion([])
				return
			}
			const result = await autocompleteSuggestions(value)
			setSearchSuggestion(result?.searches)
		} catch (error) {
			console.log('Entrada de pesquisa', 'Erro ao buscar sugestão', error)
		}
	}

	const handleAutocomplete = async e => {
		const { value } = e.target
		setSearchTerm(value)
		if (legacySearch) {
			return
		}
		const debouncedFetchSuggestions = debounce(fetchSuggestions, 400)
		debouncedFetchSuggestions(value)
	}

	const handleSuggestionSearch = suggestion => {
		setSearchTerm(suggestion)
		handleSearch(suggestion)
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

	const navigateBack = () => {
		Eitri.navigation.back()
	}

	return (
		<View className='flex relative items-center w-full'>
			<CustomInput
				// insideLeft={
				// 	<svg
				// 		xmlns='http://www.w3.org/2000/svg'
				// 		height='24px'
				// 		viewBox='0 -960 960 960'
				// 		width='24px'
				// 		className='text-[var(--header-content-color)]'
				// 		fill='currentColor'>
				// 		<path d='M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z' />
				// 	</svg>
				// }
				placeholder={t('searchInput.content')}
				value={searchTerm}
				onChange={value => handleAutocomplete(value)}
				onSubmit={value => handleSearch(value)}
				onBlur={onBlurHandler}
				autoFocus={!incomingValue}
			/>
			{searchTerm && searchSuggestion && searchSuggestion.length > 0 && (
				<View
					customColor='#fdfdfd'
					className='absolute bg-white z-9999 top-[50px] px-4 flex flex-col w-[100vw]'>
					{searchSuggestion.map((suggestion, index) => (
						<View
							key={suggestion.term}
							onClick={() => {
								handleSuggestionSearch(suggestion.term)
							}}
							className={`${index === 0 && 'mt-2'} rounded-none border-0 w-full mb-[10px]`}>
							<Text className='text-primary-content text-lg w-full'>{suggestion.term}</Text>
						</View>
					))}
				</View>
			)}
		</View>
	)
}
