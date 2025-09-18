export default function CustomCheckbox(props) {
	const { checked, onChange, label, align, justify } = props

	return (
		<View
			className={`flex flex-row ${align === 'center' ? 'items-center' : 'items-start'} ${justify === 'center' ? 'justify-center' : 'justify-start'}`}>
			<Checkbox
				checked={checked}
				onChange={() => onChange(!checked)}
			/>
			{label && (
				<View
					onClick={() => onChange(!checked)}
					className='ml-2'>
					<Text className='w-full text'>{label}</Text>
				</View>
			)}
		</View>
	)
}
