import { Text, View} from "eitri-luminus";
export default function SingleBanner(props) {
  const { data, onPress } = props
  const imagesList = data.images
  return (
    <View className="relative ">
    {data.mainTitle && (
      <View className="px-4 flex items-center justify-center w-full">
        <Text className="font-bold mb-8">{data.mainTitle}</Text>
      </View>
    )}
    
    {imagesList && imagesList[0] && (
      <View
        key={imagesList[0].imageUrl}
        onClick={() => onPress(imagesList[0])}
        className="px-4 flex flex-row w-full"
      >
        <Image 
          src={imagesList[0].imageUrl} 
          className="w-full h-full"
        />
      </View>
    )}
  </View>
  )
}
