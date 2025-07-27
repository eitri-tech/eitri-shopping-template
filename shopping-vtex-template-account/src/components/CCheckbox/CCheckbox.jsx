export default function CCheckbox(props) {
	const { checked, onChange, label, renderMode, align, justify } = props

	return (
		<View
			display='flex'
			direction='row'
			alignItems={align || 'top'}
			justifyItems={justify || 'left'}>
			<Checkbox
				renderMode={renderMode || 'default'}
				checked={checked}
				onChange={() => onChange(!checked)}
			/>
			{label && (
				<Touchable
					onPress={() => onChange(!checked)}
					marginLeft='nano'>
					<Text
						block
						paddinLeft='small'
						fontSize='extra-small'
						fontWeight='medium'>
						{label}
					</Text>
				</Touchable>
			)}
		</View>
	)
}
