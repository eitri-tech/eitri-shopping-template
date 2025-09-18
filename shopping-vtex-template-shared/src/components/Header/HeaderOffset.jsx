export default function HeaderOffset(props) {
	const { topInset } = props

	return (
		<>
			{topInset && <View topInset={'auto'} />}
			<View className={`min-h-[60px]`} />
		</>
	)
}
