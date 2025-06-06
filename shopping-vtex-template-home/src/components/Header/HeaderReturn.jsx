import Eitri from 'eitri-bifrost'

export default function HeaderReturn(props) {
	const { backPage, backgroundColor, borderColor, iconColor, onPress, width } = props

	const onBack = () => {
		if (typeof onPress === 'function') {
			return onPress()
		} else {
			if (backPage) {
				Eitri.navigation.back(backPage)
			} else {
				Eitri.navigation.back()
			}
		}
	}

	return (
		<View
    //   display='flex'
    //   alignItems='center'
    //   justifyContent='center'
	// 		width={width}
			className={`flex items-center justify-center w-[${width}px]`}
		>
       		<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 12H19M5 12L11 6M5 12L11 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
		</View>
	)
}
