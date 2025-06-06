import { Skeleton, View} from "eitri-luminus";

export default function HomeSkeleton(props) {
  const { show } = props
  return (
    <View className={`p-8 ${show ? 'block' : 'hidden'}`}>
      <View className="flex flex-col gap-4">
        <Skeleton className="w-full h-screen" />
        <View className="flex flex-row gap-4">
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </View>
        <Skeleton className="w-full h-screen" />
      </View>
    </View>
  )
}
