export default function HeaderOffset(props) {
	const { topInset } = props

	return (
		<>
			{topInset && <View topInset />}
			<View className={`min-h-[60px]`} />
		</>
	)
}
