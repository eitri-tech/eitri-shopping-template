import { Text, View } from 'eitri-luminus'
export default function HeaderText(props) {
	const { text } = props
	return (
		<View>
			<Text className={`text-[var(--header-content-color)] text-xl font-bold`}>{text}</Text>
		</View>
	)
}
