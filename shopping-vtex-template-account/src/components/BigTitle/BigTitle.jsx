import arrowLeft from '../../assets/icons/arrow-left.svg'
import Eitri from 'eitri-bifrost'

export default function BigTitle(props) {
	const { title, withBackAction } = props

	const goBack = () => {
		Eitri.navigation.back()
	}

	return (
		<View className='flex'>
			{withBackAction && (
				<View className='bg-gray-100 w-10 h-10 min-h-10 min-w-10 flex items-center rounded-full border border-gray-300 justify-center mr-8'>
					<View onClick={goBack}>
						<Image
							src={arrowLeft}
							className='w-4 h-4'
						/>
					</View>
				</View>
			)}
			<Text className='w-full font-bold text-2xl'>{title}</Text>
		</View>
	)
}
