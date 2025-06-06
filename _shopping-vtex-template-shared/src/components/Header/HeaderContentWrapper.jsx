import { getRemoteAppConfigProperty } from '../../utils/getRemoteConfigStyleProperty'
import HeaderOffset from './HeaderOffset'
import {DIMENSIONS} from "../../utils/constants";

export default function HeaderContentWrapper(props) {
	const {
		children,
		scrollEffect,
		scrollEffectMaxTranslate,
		height,
    className,
		...rest
	} = props

	const [safeAreaTop, setSafeAreaTop] = useState(0)
	const [translate, setTranslate] = useState('')

	const safeAreaTopRef = useRef()
	const scrollHandler = useRef()

	safeAreaTopRef.current = safeAreaTop

	let _height = height || DIMENSIONS.HEADER_HEIGHT

	useEffect(() => {
		initScrollEffect()
	}, [])

	const initScrollEffect = async () => {
		if (typeof scrollEffect === 'boolean' && !scrollEffect) return

		if (!scrollEffect) {
			const headerScrollEffect = await getRemoteAppConfigProperty('headerScrollEffect')
			if (!headerScrollEffect) {
				return
			}
		}
		loadSafeAreas()
		window.addEventListener('scroll', scrollHandler.current)
		return () => {
			window.removeEventListener('scroll', scrollHandler.current)
		}
	}

	const loadSafeAreas = async () => {
		const { EITRI } = window
		if (EITRI) {
			const { superAppData } = await EITRI.miniAppConfigs
			const { safeAreaInsets } = superAppData
			const { top } = safeAreaInsets
			setSafeAreaTop(top)
		}
	}

	let ticking = false
	let lastScrollTop = window.document.documentElement.scrollTop

	if (!scrollHandler.current) {
		scrollHandler.current = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					let currentScrollTop = window.document.documentElement.scrollTop
					if (currentScrollTop > lastScrollTop) {
						setTranslate(`translate-y-[${scrollEffectMaxTranslate || '-100%'}]`)
					} else if (currentScrollTop < lastScrollTop) {
						setTranslate('')
					}

					lastScrollTop = Math.max(currentScrollTop, 0)

					ticking = false
				})

				ticking = true
			}
		}
	}
	return (
		<>
			<View
				id='header-container'
        className={`fixed top-0 left-0 right-0 z-[9999] ${translate || ''} transition-all duration-1 ease-in-out shadow-md header-bg w-full`}>
				<View topInset />
				<View id='header'>
					<View
						id='header-content'
            className={`flex items-center w-screen min-h-[${_height}px] py-[16px] px-[16px] ${className}`}
						{...rest}>
						{children}
					</View>
				</View>
			</View>
			<View
				topInset
        className={`fixed top-0 left-0 right-0 z-[2000] w-full`}
			/>
			<HeaderOffset height={_height} />
		</>
	)
}
