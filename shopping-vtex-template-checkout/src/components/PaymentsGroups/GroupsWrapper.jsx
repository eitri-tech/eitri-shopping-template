import { View, Text, Button, Radio } from 'eitri-luminus'

export default function GroupsWrapper(props) {
	const { title, icon, isChecked, children, onPress } = props

	return (
		<Button
			onClick={onPress}
			className="py-2 px-1 border border-neutral-400 rounded flex flex-col">
			<View className="w-full flex flex-col">
				<View className="flex flex-row items-center justify-between gap-3">
					<View className="flex flex-row items-center gap-3">
						<Radio checked={isChecked} />
						<Text className="text-xs">{title}</Text>
					</View>

					<View>{icon}</View>
				</View>
			</View>
			{children && isChecked && <View className="mt-4">{children}</View>}
		</Button>
	)
}
