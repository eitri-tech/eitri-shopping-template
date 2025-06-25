import { Loading } from 'shopping-vtex-template-shared'
import { View, Skeleton } from 'eitri-luminus'
export default function ProductCardLoading(props) {
	const { width, gap } = props
	return (
		<View className='flex justify-center gap-4 px-4 py-2'>
			<View className='w-[50%]'>
				<Skeleton className='p-2 bg-neutral-100 h-[341px] w-full'></Skeleton>
			</View>
			<View className=' w-[50%]'>
				<Skeleton className='p-2 bg-neutral-100  h-[341px] w-full'></Skeleton>
			</View>
		</View>
	)
}
