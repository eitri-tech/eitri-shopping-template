import Eitri from 'eitri-bifrost'
import { useState } from 'react'

export default function CardPage() {
	const [showLimit, setShowLimit] = useState(true)
	const [showBill, setShowBill] = useState(true)
	const [currentCardIndex, setCurrentCardIndex] = useState(0)

	const cards = [
		{
			id: 1,
			brand: 'Visa',
			name: 'MARIA SILVA SANTOS',
			number: '**** **** **** 1234',
			color: 'bg-gradient-to-br from-purple-600 to-purple-800'
		},
		{
			id: 2,
			brand: 'Mastercard',
			name: 'JOSÉ CARLOS OLIVEIRA',
			number: '**** **** **** 5678',
			color: 'bg-gradient-to-br from-blue-600 to-blue-800'
		},
		{
			id: 3,
			brand: 'American Express',
			name: 'ANA PAULA COSTA',
			number: '**** **** **** 9012',
			color: 'bg-gradient-to-br from-green-600 to-green-800'
		}
	]

	const currentCard = cards[currentCardIndex]

	const navigateToPurchase = () => {
		Eitri.navigation.navigate({
			path: '/Home',
			state: { tab: 'purchase' }
		})
	}

	const navigateToBills = () => {
		Eitri.navigation.navigate({
			path: '/Home',
			state: { tab: 'bills' }
		})
	}

	const toggleLimitVisibility = () => {
		setShowLimit(!showLimit)
	}

	const toggleBillVisibility = () => {
		setShowBill(!showBill)
	}

	const nextCard = () => {
		setCurrentCardIndex(prev => (prev + 1) % cards.length)
	}

	const prevCard = () => {
		setCurrentCardIndex(prev => (prev - 1 + cards.length) % cards.length)
	}

	return (
		<Page
			viewportColor='bg-gray-50'
			pullToAction={{
				onRefresh: () => {
					return new Promise(resolve => {
						setTimeout(() => {
							console.log('refreshing card data')
							resolve()
						}, 1000)
					})
				}
			}}>
			<View className='p-4 pt-8 h-min-screen flex flex-col'>
				{/* Header */}
				<View className='flex flex-row items-center justify-between mb-6'>
					<View className='flex flex-row items-center gap-3'>
						<Button
							className='btn-ghost btn-circle btn-sm'
							onClick={() => Eitri.navigation.goBack()}>
							<Text className='text-xl'>←</Text>
						</Button>
						<View>
							<Text className='text-lg font-semibold text-gray-800'>Olá, Maria</Text>
							<Text className='text-sm text-gray-500'>Seu cartão está ativo</Text>
						</View>
					</View>
					<Avatar>
						<Avatar.Image src='https://api.dicebear.com/9.x/avataaars/svg?seed=Maria' />
					</Avatar>
				</View>

				{/* Card Principal */}
				<View className='mb-6'>
					<Card className={`${currentCard.color} text-white shadow-2xl border-0`}>
						<Card.Body className='p-6'>
							<View className='flex flex-row justify-between items-start mb-8'>
								<View>
									<Text className='text-xl font-bold mb-1'>{currentCard.brand}</Text>
									<Text className='text-sm opacity-80'>Cartão Premium</Text>
								</View>
								<View className='w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
									<Text className='text-xs font-bold'>VIP</Text>
								</View>
							</View>

							<View className='mb-6'>
								<Text className='text-sm opacity-80 mb-2'>Titular do Cartão</Text>
								<Text className='text-lg font-semibold'>{currentCard.name}</Text>
							</View>

							<View className='mb-4'>
								<Text className='text-sm opacity-80 mb-2'>Número do Cartão</Text>
								<Text className='text-xl font-mono tracking-wider'>{currentCard.number}</Text>
							</View>

							<View className='flex flex-row justify-between items-center'>
								<View>
									<Text className='text-xs opacity-80'>Válido até</Text>
									<Text className='text-sm font-semibold'>12/28</Text>
								</View>
								<View>
									<Text className='text-xs opacity-80'>CVV</Text>
									<Text className='text-sm font-semibold'>***</Text>
								</View>
							</View>
						</Card.Body>
					</Card>

					{/* Indicadores de Card */}
					<View className='flex flex-row justify-center gap-2 mt-4'>
						{cards.map((_, index) => (
							<View
								key={index}
								className={`w-2 h-2 rounded-full ${
									index === currentCardIndex ? 'bg-purple-600' : 'bg-gray-300'
								}`}
							/>
						))}
					</View>

					{/* Botões de Navegação do Card */}
					<View className='flex flex-row justify-between mt-4'>
						<Button
							className='btn-ghost btn-sm'
							onClick={prevCard}>
							<Text>‹</Text>
						</Button>
						<Button
							className='btn-ghost btn-sm'
							onClick={nextCard}>
							<Text>›</Text>
						</Button>
					</View>
				</View>

				{/* Limite Disponível */}
				<View className='bg-white rounded-xl p-4 mb-4 shadow-sm'>
					<View className='flex flex-row justify-between items-center mb-3'>
						<Text className='text-lg font-semibold text-gray-800'>Limite Disponível</Text>
						<Button
							className='btn-ghost btn-sm'
							onClick={toggleLimitVisibility}>
							<Text className='text-xl'>{showLimit ? '👁️' : '🙈'}</Text>
						</Button>
					</View>

					<Text className='text-3xl font-bold text-purple-600 mb-3'>
						{showLimit ? 'R$ 2.450,00' : '••••••••'}
					</Text>

					<Progress
						value={65}
						max={100}
						className='mb-3'
					/>

					<View className='flex flex-row justify-between text-sm'>
						<Text className='text-gray-600'>
							Utilizado: <Text className='font-semibold text-purple-600'>R$ 1.550,00</Text>
						</Text>
						<Text className='text-gray-600'>
							Total: <Text className='font-semibold'>R$ 4.000,00</Text>
						</Text>
					</View>
				</View>

				{/* Fatura Atual */}
				<View className='bg-white rounded-xl p-4 mb-6 shadow-sm'>
					<View className='flex flex-row justify-between items-center mb-3'>
						<Text className='text-lg font-semibold text-gray-800'>Fatura Atual</Text>
						<Button
							className='btn-ghost btn-sm'
							onClick={toggleBillVisibility}>
							<Text className='text-xl'>{showBill ? '👁️' : '🙈'}</Text>
						</Button>
					</View>

					<Text className='text-3xl font-bold text-red-600 mb-2'>{showBill ? 'R$ 890,00' : '••••••••'}</Text>

					<View className='flex flex-row justify-between items-center'>
						<Text className='text-sm text-gray-600'>
							Vencimento: <Text className='font-semibold'>15/12/2024</Text>
						</Text>
						<Badge className='badge-success badge-sm'>Em dia</Badge>
					</View>

					<Text className='text-xs text-gray-500 mt-2'>Melhor dia de compra: 05 de cada mês</Text>
				</View>

				{/* Navegação Inferior */}
				<View className='flex flex-row gap-4 mt-auto'>
					<Button
						className='btn-primary flex-1 h-16'
						onClick={navigateToPurchase}>
						<View className='flex flex-col items-center'>
							<Text className='text-2xl mb-1'>🛒</Text>
							<Text className='text-sm font-semibold'>Comprar</Text>
						</View>
					</Button>

					<Button
						className='btn-secondary flex-1 h-16'
						onClick={navigateToBills}>
						<View className='flex flex-col items-center'>
							<Text className='text-2xl mb-1'>📄</Text>
							<Text className='text-sm font-semibold'>Faturas</Text>
						</View>
					</Button>
				</View>

				{/* Ações Rápidas */}
				<View className='flex flex-row gap-3 mt-4'>
					<Button className='btn-outline btn-sm flex-1'>
						<Text className='text-sm'>Bloquear</Text>
					</Button>
					<Button className='btn-outline btn-sm flex-1'>
						<Text className='text-sm'>Limite</Text>
					</Button>
					<Button className='btn-outline btn-sm flex-1'>
						<Text className='text-sm'>Ajuda</Text>
					</Button>
				</View>
			</View>
		</Page>
	)
}
