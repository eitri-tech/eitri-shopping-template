export default function CheckoutInput(props) {
	const { icon, type, backgroundColor, mask, label, width, ...rest } = props

	return (
		<View className='w-full'>
			{label && (
				<View className='mb-2'>
					<Text
						fontSize='extra-small'
						fontWeight={'bold'}>
						{label}
					</Text>
				</View>
			)}
			<View
				className={`${backgroundColor || 'bg-background-color'} border border-neutral-300 h-[37px] flex items-center text-neutral-500 px-4 ${width || 'w-full'} rounded-full`}>
				{icon && (
					<View>
						<Image src={icon} />
					</View>
				)}
				{mask ? (
					<TextInput
						variant='mask'
						mask={mask}
					/>
				) : (
					<TextInput {...rest} />
				)}
			</View>
		</View>
	)
}
