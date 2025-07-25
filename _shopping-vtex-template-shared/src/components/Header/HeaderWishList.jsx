export default function HeaderWishList(props) {
	const { filled, onPress, padding } = props

	return (
		<View
			padding={padding || 'small'}
			onPress={onPress}>
			{filled ? (
				<svg
					width='24'
					height='22'
					viewBox='0 0 24 22'
					fill='currentColor'
					xmlns='http://www.w3.org/2000/svg'>
					<path
						d='M18.9199 3.93892C16.4332 2.38538 14.2629 3.01144 12.9591 4.00868C12.4246 4.41757 12.1573 4.62202 12 4.62202C11.8428 4.62202 11.5755 4.41757 11.0409 4.00868C9.73712 3.01144 7.56681 2.38538 5.08019 3.93892C1.81678 5.97777 1.07834 12.704 8.60577 18.3787C10.0395 19.4596 10.7564 20 12 20C13.2437 20 13.9605 19.4596 15.3943 18.3787C22.9217 12.704 22.1833 5.97777 18.9199 3.93892Z'
						stroke='currentColor'
						strokeWidth='1.5'
						strokeLinecap='round'
						className='text-header-content'
					/>
				</svg>
			) : (
				<svg
					width='24'
					height='22'
					viewBox='0 0 24 22'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'>
					<path
						d='M18.9199 3.93892C16.4332 2.38538 14.2629 3.01144 12.9591 4.00868C12.4246 4.41757 12.1573 4.62202 12 4.62202C11.8428 4.62202 11.5755 4.41757 11.0409 4.00868C9.73712 3.01144 7.56681 2.38538 5.08019 3.93892C1.81678 5.97777 1.07834 12.704 8.60577 18.3787C10.0395 19.4596 10.7564 20 12 20C13.2437 20 13.9605 19.4596 15.3943 18.3787C22.9217 12.704 22.1833 5.97777 18.9199 3.93892Z'
						stroke='currentColor'
						strokeWidth='1.5'
						strokeLinecap='round'
						className='text-header-content'
					/>
				</svg>
			)}
		</View>
	)
}
