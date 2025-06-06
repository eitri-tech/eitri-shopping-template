import { Image, View} from "eitri-luminus";
export default function HeaderLogo(props) {
	const { src, height } = props

	return (
		<View className="h-[50px] w-[150px] flex items-center">
			<Image
				src={src}
				className="w-full h-full"
			/>
		</View>
	)
}
