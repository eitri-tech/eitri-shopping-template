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
			display='flex'
			alignItems='center'
			justifyContent='center'
			width={width}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				height='24px'
				viewBox='0 -960 960 960'
				width='24px'
				className='text-[var(--header-content-color)]'
				fill='currentColor'>
				<path d='M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z' />
			</svg>
		</View>
	)
}
