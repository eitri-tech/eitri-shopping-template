import { Image, View} from "eitri-luminus";
export default function HeaderLogo(props) {
	const { src, height } = props

	return (
		<View className="h-[50px] w-[80%] flex">
			<Image
				src={src}
				className="h-full"
			/>
		</View>
	)
}
