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
		return isLoading || disabled ? 'neutral-100' : backgroundColor || 'primary-700'
	})()

	const _borderColor = (() => {
		return isLoading || disabled ? 'neutral-100' : backgroundColor || 'primary-700'
	})()

	return (
		<Button
			className={`
				flex items-center justify-center 
				w-full
				${_backgroundColor ? `bg-${_backgroundColor}` : ""}
				rounded-full
				${variant === "outlined" ? "border border-[1px]" : ""}
				${_borderColor ? `border-${_borderColor} text-${_borderColor}` : ""}
			`}
			{...rest}
			>
			{isLoading ? (
				<Loading />
			) : (
				<Text className="font-bold">{label}</Text>
			)}
		</Button>

	)
}
