export default function CardSelector(props) {
	const { children, mainTitle, mainClickHandler, secondaryActionHandler, secondaryActionTitle } = props

	return (
		<View className='bg-white rounded shadow-sm border border-gray-300 p-4 mt-4'>
			<View
				onClick={mainClickHandler}
				className='flex flex-col'>
				<View className='flex flex-row items-center justify-between mb-1'>
					<Text className='font-bold text-lg block'>{mainTitle}</Text>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='text-primary'>
						<polyline points='9 18 15 12 9 6'></polyline>
					</svg>
				</View>
				{children}
			</View>

			<View className='border-b my-4'></View>

			<View onClick={secondaryActionHandler}>
				<Text className='text-primary font-bold'>{secondaryActionTitle}</Text>
			</View>
		</View>
	)
}
