import { Text, View} from "eitri-luminus";
export default function GridList(props) {
  const { data, onPress } = props
  const imagesList = data?.images
  return (
    <View>
      {data?.mainTitle && (
        <View className="px-4">
          <Text className="font-bold">{data.mainTitle}</Text>
        </View>
      )}
      <View className="flex flex-wrap px-4 justify-between">
        {imagesList?.map((image) => (
          <View
            key={image.imageUrl}
            onClick={() => onPress(image)}
            className="w-[calc(50%-8px)]" // Adjust for two items per row with spacing
          >
            <Image src={image.imageUrl} className="w-full h-auto" />
          </View>
        ))}
      </View>
    </View>
  )
}
