import Eitri from 'eitri-bifrost'
import { Text, View} from "eitri-luminus";
import { Vtex } from 'eitri-shopping-vtex-shared'
import { autocompleteSuggestions } from '../../services/ProductService'
import CInput from '../CInput/CInput'
import searchIcon from '../../assets/icons/search-normal.svg'
import { useTranslation } from 'eitri-i18n'
let timeoutId
export default function SearchInput(props) {
  const { onSubmit, incomingValue } = props
  const [searchTerm, setSearchTerm] = useState(incomingValue || '')
  const [searchSuggestion, setSearchSuggestion] = useState([])
  const { t } = useTranslation()
  const legacySearch = Vtex?.configs?.searchOptions?.legacySearch
  const debounce = (func, delay) => {
    return function (...args) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func.apply(this, args), delay)
    }
  }
  const fetchSuggestions = async (value) => {
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
  const handleAutocomplete = async (e) => {
    const {value} = e.target
    setSearchTerm(value)
    if (legacySearch) {
      return
    }
    const debouncedFetchSuggestions = debounce(fetchSuggestions, 400)
    debouncedFetchSuggestions(value)
  }
  const handleSuggestionSearch = (suggestion) => {
    setSearchTerm(suggestion)
    handleSearch(suggestion)
  }
  const handleSearch = (suggestion) => {
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
    <View width="100%" className="flex relative items-center w-full">
      <View
        onClick={navigateBack}
        className="flex items-center justify-center border-neutral-300 ml-[10px] rounded-full w-[25px] h-[25px]"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 6L9 12L15 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
      </View>
      <View width="100%">
        <CInput
          icon={searchIcon}
          placeholder={t('searchInput.content')}
          value={searchTerm}
          onChange={(value) => handleAutocomplete(value)}
          onSubmit={(value) => handleSearch(value)}
          onBlur={onBlurHandler}
          autoFocus={!incomingValue}
        />
      </View>
      {searchTerm && searchSuggestion && searchSuggestion.length > 0 && (
        <View
          customColor="#fdfdfd"
          className="absolute bg-white z-9999 top-[50px] px-4 flex flex-col w-[100vw]"
        >
          {searchSuggestion.map((suggestion, index) => (
            <View
              key={suggestion.term}
              onClick={() => {
                handleSuggestionSearch(suggestion.term)
              }}
              className={`${index === 0 && 'mt-2'} rounded-none border-0 w-full mb-[10px]`}
            >
              <Text className="text-primary-content text-lg w-full">
                {suggestion.term}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
