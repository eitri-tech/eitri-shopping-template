import { Text, View } from 'eitri-luminus'
export default function BannerList(props) {
	const { data, onClick } = props
	const imagesList = data.images
	const { size, aspectRatio } = data

	const getBannerDimensions = () => {
		const maxWidth = size?.maxWidth
		const maxHeight = size?.maxHeight

		// Define a largura inicial baseada no maxWidth ou um padrão.
		let finalWidth = maxWidth || 200
		// A altura inicial é baseada no maxHeight ou no mesmo padrão.
		let finalHeight = maxHeight || 200

		if (aspectRatio) {
			try {
				const [aspectW, aspectH] = aspectRatio.split(':').map(Number)
				const numericRatio = aspectH / aspectW

				if (!isNaN(numericRatio)) {
					// Calcula a altura com base na largura inicial.
					const calculatedHeight = finalWidth * numericRatio

					// Se a altura calculada ultrapassar o maxHeight, o maxHeight vira a restrição principal.
					if (maxHeight && calculatedHeight > maxHeight) {
						finalHeight = maxHeight
						finalWidth = maxHeight / numericRatio // Recalcula a largura com base na altura máxima.
					} else {
						finalHeight = calculatedHeight
					}
				}
			} catch (e) {
				// Em caso de erro no formato do aspectRatio, usa os valores padrão.
			}
		}

		return { width: `${finalWidth}px`, height: `${finalHeight}px` }
	}

	return (
		<View className='flex flex-col gap-2'>
			{data?.mainTitle && (
				<View className='px-4'>
					<Text className='font-bold text-lg'>{data.mainTitle}</Text>
				</View>
			)}
			<View className='flex overflow-x-auto'>
				<View className='flex gap-4 px-4'>
					{imagesList &&
						imagesList.map(slider => (
							<View
								key={slider.imageUrl}
								className='flex flex-col'>
								<View // Adicionado key para melhor performance e para seguir as boas práticas do React
									style={{
										backgroundImage: `url(${slider.imageUrl})`,
										...getBannerDimensions(),
										backgroundSize: 'cover'
									}}
									className={'rounded'}
									onClick={() => onClick(slider)}
								/>
								{slider?.action?.title && (
									<View
										style={{
											...getBannerDimensions(),
											height: 'initial'
										}}
										className='mt-1'>
										<Text className='font-bold line-clamp-2'>{slider?.action?.title}</Text>
									</View>
								)}
							</View>
						))}
				</View>
			</View>
		</View>
	)
}
