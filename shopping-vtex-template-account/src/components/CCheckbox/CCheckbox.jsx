export default function CCheckbox(props) {
	const { checked, onChange, label, renderMode, align, justify } = props

	return (
		<View
			className={`flex flex-row ${align === 'center' ? 'items-center' : 'items-start'} ${justify === 'center' ? 'justify-center' : 'justify-start'}`}>
			<Checkbox
				renderMode={renderMode || 'default'}
				checked={checked}
				onChange={() => onChange(!checked)}
			/>
			{label && (
				<View
					onClick={() => onChange(!checked)}
					className='ml-1'>
					<Text className='w-full pl-3 text-xs font-medium'>{label}</Text>
				</View>
			)}
		</View>
	)
}
