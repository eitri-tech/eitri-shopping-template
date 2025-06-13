export default function CModal(props) {
	const { children } = props

	return (
		<View className='fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[9999]'>
			<View>
				{children}
				<View bottomInset />
			</View>
		</View>
	)
}
