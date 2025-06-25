import imgBox from '../../assets/images/box-01.svg'

export default function NoItem(props) {
	const { title, subtitle } = props

	return (
		<View className='flex flex-col justify-center items-center gap-4 p-6'>
			{/*<Icon*/}
			{/*  iconKey='package'*/}
			{/*  color='primary-700'*/}
			{/*  width={48}*/}
			{/*  height={48}*/}
			{/*/>*/}
			<Text className='w-full text-center font-bold text-sm'>{title}</Text>
			<Text className='w-full text-center font-medium text-sm'>{subtitle}</Text>
		</View>
	)
}
