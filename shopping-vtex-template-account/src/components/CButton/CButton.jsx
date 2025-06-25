export default function CButton(props) {
	const { icon, iconPosition, label, iconJustify, iconKey, ...rest } = props

	if (icon) {
		return (
			<View
				className={`${props.variant === 'outlined' ? 'bg-transparent' : props.backgroundColor || 'bg-blue-700'} border border-blue-700 rounded-full text-xs w-full h-10 px-8 py-2 font-medium text-blue-500`}
				onClick={props.onPress}>
				<View className={`flex gap-2.5 w-full ${iconJustify || 'justify-center'} items-center`}>
					{iconPosition === 'right' && label}
					{iconKey ? (
						<></>
					) : (
						<Image
							src={icon}
							className='h-5'
						/>
					)}
					{iconPosition !== 'right' && label}
				</View>
			</View>
		)
	}

	return (
		<Button
			className='rounded-full text-xs w-full font-medium'
			label={label}
			{...rest}
		/>
	)
}
