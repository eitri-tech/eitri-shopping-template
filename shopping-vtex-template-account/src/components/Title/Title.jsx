import arrowLeft from '../../assets/icons/arrow-left.svg'
import Eitri from 'eitri-bifrost'

export default function Title(props) {
	const { title, withBackAction } = props

	const goBack = () => {
		Eitri.navigation.back()
	}

	return (
		<View className='px-6 py-4 border-b border-gray-300 flex gap-6'>
			{withBackAction && (
				<View className='bg-gray-100 w-10 h-10 min-h-10 min-w-10 flex items-center rounded-full border border-gray-300 justify-center'>
					<View onClick={goBack}>
						<Image
							src={arrowLeft}
							className='w-4 h-4'
						/>
					</View>
				</View>
			)}
			<Text className='w-full font-bold text-xl'>{title}</Text>
		</View>
	)
}
