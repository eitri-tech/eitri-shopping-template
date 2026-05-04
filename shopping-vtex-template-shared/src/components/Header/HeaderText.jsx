import { Text, View } from 'eitri-luminus'

export default function HeaderText(props) {
	const { text, className = '' } = props

	return (
		<View>
			<Text className={`text-header-content text-xl font-bold ${className}`}>{text}</Text>
		</View>
	)
}
