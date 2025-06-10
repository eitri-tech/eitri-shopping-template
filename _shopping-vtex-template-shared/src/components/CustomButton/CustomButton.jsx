import Loading from '../Loading/LoadingComponent'

export default function CustomButton(props) {
	const { disabled, color, backgroundColor, variant, label, onPress, isLoading, width, borderRadius, ...rest } = props

	const _onPress = () => {
		if (!disabled && onPress && typeof onPress === 'function') {
			onPress()
		}
	}

	const _backgroundColor = (() => {
		if (variant === 'outlined') {
			return 'transparent'
		}
		return isLoading || disabled ? 'neutral-100' : 'primary'
	})()

	const _contentColor = (() => {
		if (variant === 'outlined') {
			return 'primary'
		}
		return isLoading || disabled ? 'neutral-100' : 'primary-content'
	})()

	return (
		<View
			onClick={_onPress}
			className={`
				flex items-center justify-center 
				w-full
				h-[45px]
				rounded
				${_backgroundColor ? `bg-${_backgroundColor}` : ''}
				${variant === 'outlined' ? `border border-[2px] border-primary` : ''}
			`}
			{...rest}>
			{isLoading ? <Loading /> : <Text className={`font-bold text-${_contentColor}`}>{label}</Text>}
		</View>
	)
}
