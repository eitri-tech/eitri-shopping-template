import { View, Text, Button } from 'eitri-luminus'

export default function Quantity(props) {
	const { quantity, handleItemQuantity, disable } = props

	return (
		<View className='flex items-center border border-gray-300 rounded px-2'>
			<View className='w-1/3 flex items-center justify-center'>
				{quantity === 1 || disable ? (
					<svg
						width='16px'
						height='16px'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M6 12L18 12'
							stroke='#000000'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				) : (
					<View onClick={() => handleItemQuantity(-1)}>
						<svg
							width='16px'
							height='16px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M6 12L18 12'
								stroke='#000000'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				)}
			</View>

			<Text className='px-3 py-2 text-sm font-medium min-w-[3rem] text-center'>{quantity}</Text>

			<View className='w-1/3 items-center justify-center pl-1'>
				{disable ? (
					<View className='w-[16px] h-[16px]'>
						<svg
							width='16px'
							height='16px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M6 12H18M12 6V18'
								stroke='#000000'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				) : (
					<View onClick={() => handleItemQuantity(1)}>
						<svg
							width='16px'
							height='16px'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								d='M6 12H18M12 6V18'
								stroke='#000000'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</View>
				)}
			</View>
		</View>
	)
}
