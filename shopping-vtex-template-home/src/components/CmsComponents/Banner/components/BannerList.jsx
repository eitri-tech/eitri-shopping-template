import SwiperContent from '../../../SwiperContent/SwiperContent'
import { Text, View, Image} from "eitri-luminus";
export default function BannerList(props) {
  const { data, onPress } = props
  const imagesList = data.images

  const isANumber = (value) => 
    typeof value === "number" || /^\d+$/.test(value) ? true : false;

  const width = data?.size?.maxWidth;
  const height = data?.size?.maxHeight;
  return (
    <View className="flex flex-col gap-2">
      {data?.mainTitle && (
        <View className="px-4">
          <Text className="font-bold text-xl">{data.mainTitle}</Text>
        </View>
      )} 
      <SwiperContent className="px-4">
        {imagesList &&
          imagesList.map((slider) => (
              <Image
                src={slider.imageUrl}
                maxHeight={height}
                maxWidth={width}
                className={`bg-neutral rounded-lg flex-grow`}
              /> 
          ))}
      </SwiperContent>
    </View>
  )
}
