import { Text, View} from "eitri-luminus";
export default function HeaderText(props) {
	const { text, contentColor } = props
	return (
		<View 
		// display='flex' width={'100%'} justifyContent='center'
			className="flex w-full justify-center"
		>
			<Text
				// color={contentColor}
				// fontSize='extra-large'
				// fontWeight={'bold'}
				className={`text-2xl font-bold`}
			>
				{text}
			</Text>
		</View>
	)
}
