import { Text, View} from "eitri-luminus";
export default function FitOnScreen(props) {
  const { data, onPress } = props
  return (
    <View >
      {data?.mainTitle && (
        <View className="px-4">
          <Text className="font-bold">{data.mainTitle}</Text>
        </View>
      )}
      <View className="flex justify-between px-4 overflow-scroll">
        {data?.images?.map((image) => (
           <View
              key={image.imageUrl}
              onClick={() => onPress(image)}
            >
              <Image 
                src={image.imageUrl} 
              />
            </View>
        ))}
      </View>
    </View>
  )
}
