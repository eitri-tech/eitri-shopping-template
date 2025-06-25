export default function Information(props) {
	const { showInfo, rewards, objectives, points, handleShare, openModal } = props

	// TODO - precisa internacionalizar?

	const availablePoints = pointsNeeded => {
		return points?.Item?.PointsBalance >= pointsNeeded
	}

	return (
		<View className='p-3'>
			{showInfo === 'rewards' &&
				rewards?.Item?.map(
					(item, index) =>
						item.Enabled && (
							<View
								key={index}
								className='flex flex-row p-3 border border-gray-300 rounded-md mb-3 justify-between items-center'>
								<View className='flex flex-col'>
									{item.Title != 'Frete Grátis' && <Text>Cupom de:</Text>}
									<Text className='font-bold text-base'>{item.Title}</Text>
									<Text className='text-base'>{`por ${item.Points} pontos`}</Text>
								</View>
								<View onClick={() => openModal(item)}>
									<View
										className={`flex border border-gray-300 rounded-md w-25 h-10 items-center justify-center ${availablePoints(item.Points) ? 'border-blue-700' : 'border-gray-500'}`}>
										<Text
											className={
												availablePoints(item.Points) ? 'text-blue-700' : 'text-gray-500'
											}>
											Resgatar
										</Text>
									</View>
								</View>
							</View>
						)
				)}
			{showInfo === 'objectives' &&
				objectives?.Item?.map(
					(item, index) =>
						item.IsCompleted === false &&
						(item.Type === 4 && item.ReferralUrl ? (
							<View
								key={index}
								className='flex flex-row p-3 border border-gray-300 rounded-md mb-3'>
								<Text className='font-bold text-base'>{item.Title}</Text>
								<View onClick={() => handleShare(item.WhatsAppShareText)}>
									<View className='flex border border-blue-700 rounded-md w-25 h-10 items-center justify-center'>
										<Text className='text-blue-700'>Indicar</Text>
									</View>
								</View>
							</View>
						) : (
							<View
								key={index}
								className='flex flex-col p-3 border border-gray-300 rounded-md mb-3'>
								<Text className='font-bold text-base'>{item.Title}</Text>
								<Text className='text-sm'>{item.Description}</Text>
							</View>
						))
				)}
		</View>
	)
}
