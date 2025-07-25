import { Image } from 'eitri-luminus'

export default function ProfileCardButton(props) {
	const { icon, label, onClick } = props

	return (
		<View
			className='flex justify-between bg-white rounded shadow-sm border border-gray-300 p-4 w-full'
			onClick={onClick}>
			<View className='flex flex-row items-center gap-3'>
				<Image
					src={icon}
					width={24}
					height={24}
				/>
				<Text className='text-gray-900 text-base font-medium'>{label}</Text>
			</View>
			<View>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='24'
					height='24'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.5'
					strokeLinecap='round'
					className='text'>
					<line
						x1='5'
						y1='12'
						x2='19'
						y2='12'></line>
					<polyline points='12 5 19 12 12 19'></polyline>
				</svg>
			</View>
		</View>
	)
}
