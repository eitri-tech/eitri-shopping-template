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

	useEffect(() => {
		if (inputRef.current) {
			console.log('inputRef', inputRef.current)
			inputRef?.current?.focus()
		}
	}, [])

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

	const handleAutocomplete = async value => {
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
		<View
			width='100%'
			display='flex'
			gap='16px'
			position='relative'
			alignItems='center'>
			<View
				borderColor='neutral-300'
				borderWidth='hairline'
				borderRadius='pill'
				justifyContent='between'
				height='40px'
				width='100%'
				display='flex'
				alignItems='center'
				backgroundColor='neutral-100'
				paddingHorizontal='large'>
				<View>
					<Image
						src={searchIcon}
						width='16px'
					/>
				</View>

				<TextInput
					ref={inputRef}
					autoFocus={true}
					type={'text'}
					value={searchTerm}
					onChange={value => handleAutocomplete(value)}
					onSubmit={value => handleSearch(value)}
					onBlur={onBlurHandler}
					placeholder={'Pesquisar...'}
				/>

				<View
					display='flex'
					gap={10}>
					{searchTerm && (
						<View
							onPress={() => setSearchTerm('')}
							padding='quark'
							backgroundColor='neutral-900'
							borderRadius='circular'>
							{/* <Icon
								iconKey='x'
								color='accent-100'
								width={16}
								height={16}
							/> */}
						</View>
					)}

					{/* <Touchable onPress={navigateBack}>
						<Icon
							iconKey='x'
							color='primary-500'
							width={24}
							height={24}
						/>
					</Touchable> */}
				</View>
			</View>
		</View>
	)
}
