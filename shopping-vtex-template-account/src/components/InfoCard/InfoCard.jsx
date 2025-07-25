export default function InfoCard(props) {
	const { customerData } = props

	return (
		<View className='p-4 bg-white rounded shadow-sm border border-gray-300 '>
			<View className='rounded-xl flex-row gap-4 items-center shadow-sm p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'>
				<View className='flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md'>
					<Text className='text-2xl font-bold text-white'>
						{(customerData?.firstName ?? customerData?.email)?.charAt(0)?.toLocaleUpperCase()}
					</Text>
				</View>

				<View className='flex flex-col gap-1 flex-1'>
					{customerData?.firstName && (
						<Text className='font-bold text-lg text-gray-800'>
							{`${customerData.firstName} ${customerData.lastName}`}
						</Text>
					)}

					{customerData?.email && <Text className='text-sm text-gray-600'>{customerData.email}</Text>}
				</View>
			</View>
		</View>
	)
}
