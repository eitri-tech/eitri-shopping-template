import { Text, View} from "eitri-luminus";
export default function HeaderText(props) {
	const { text, contentColor } = props
	return (
		<View className="flex w-full justify-center">
			<Text className={`text-${contentColor} text-xl font-bold`}>
				{text}
			</Text>
		</View>
	)
}
