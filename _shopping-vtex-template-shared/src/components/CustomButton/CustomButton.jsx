import Loading from '../Loading/LoadingComponent'

export default function CustomButton(props) {
	const {
		disabled,
		color,
		backgroundColor,
		variant,
		label,
		onPress,
		onClick,
		isLoading,
		width,
		borderRadius,
		className,
		outlined,
		...rest
	} = props

	const _onPress = () => {
		if (!disabled && onPress && typeof onPress === 'function') {
			onPress()
		}

		if (!disabled && onClick && typeof onClick === 'function') {
			onClick()
		}
	}

	const _backgroundColor = (() => {
		if (variant === 'outlined' || outlined) {
			return 'transparent'
		}
		return isLoading || disabled ? 'bg-gray-300' : 'bg-primary'
	})()

	const _contentColor = (() => {
		if (variant === 'outlined' || outlined) {
			return 'primary'
		}
		return isLoading || disabled ? 'text-gray-500' : 'text-primary-content'
	})()

	return (
		<View
			onClick={_onPress}
			className={`
				flex items-center justify-center 
				h-[45px]
				rounded
				${_backgroundColor ? `${_backgroundColor}` : ''}
				${variant === 'outlined' ? `border border border-primary` : ''}
				${className || ''}
			`}
			{...rest}>
			{isLoading ? <Loading /> : <Text className={`font-bold ${_contentColor}`}>{label}</Text>}
		</View>
	)
}
