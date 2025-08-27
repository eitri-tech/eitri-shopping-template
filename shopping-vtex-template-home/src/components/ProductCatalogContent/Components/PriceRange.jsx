import { useState, useRef, useCallback, useEffect } from 'react'
import { View, Text, TextInput } from 'eitri-luminus'
import { CustomInput } from 'shopping-vtex-template-shared'
import { formatPrice } from '../../../utils/utils'

export default function PriceRange({
	initialMin = 20,
	initialMax = 80,
	onChange,
	rangeMin = 0,
	rangeMax = 100,
	step = 1
}) {
	const [minValue, setMinValue] = useState(initialMin)
	const [maxValue, setMaxValue] = useState(initialMax)
	const [isDragging, setIsDragging] = useState(null)

	const sliderRef = useRef(null)
	const minThumbRef = useRef(null)
	const maxThumbRef = useRef(null)

	// Sync with props when they change
	useEffect(() => {
		setMinValue(initialMin)
		setMaxValue(initialMax)
	}, [initialMin, initialMax])

	// Call onChange whenever values change
	useEffect(() => {
		if (onChange) {
			onChange(`${minValue}:${maxValue}`)
		}
	}, [minValue, maxValue, onChange])

	const getValueFromPosition = useCallback(
		clientX => {
			if (!sliderRef.current) return 0
			const rect = document.getElementById('slider').getBoundingClientRect()
			const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
			const value = Math.round((percentage * (rangeMax - rangeMin) + rangeMin) / step) * step

			return Math.max(rangeMin, Math.min(rangeMax, value))
		},
		[rangeMin, rangeMax, step]
	)

	const handleMouseDown = thumb => e => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(thumb)

		const handleMouseMove = e => {
			const newValue = getValueFromPosition(e.clientX)

			if (thumb === 'min') {
				setMinValue(Math.min(newValue, maxValue - step))
			} else {
				setMaxValue(Math.max(newValue, minValue + step))
			}
		}

		const handleMouseUp = () => {
			setIsDragging(null)
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	const handleTouchStart = thumb => e => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(thumb)

		const handleTouchMove = e => {
			const touch = e.touches[0]
			const newValue = getValueFromPosition(touch.clientX)

			if (thumb === 'min') {
				setMinValue(Math.min(newValue, maxValue - step))
			} else {
				setMaxValue(Math.max(newValue, minValue + step))
			}
		}

		const handleTouchEnd = () => {
			setIsDragging(null)
			document.removeEventListener('touchmove', handleTouchMove)
			document.removeEventListener('touchend', handleTouchEnd)
		}

		document.addEventListener('touchmove', handleTouchMove)
		document.addEventListener('touchend', handleTouchEnd)
	}

	const minPercentage = ((minValue - rangeMin) / (rangeMax - rangeMin)) * 100
	const maxPercentage = ((maxValue - rangeMin) / (rangeMax - rangeMin)) * 100

	return (
		<View className='w-full bg-white'>
			<View className='mb-4'>
				<View className='relative px-2 h-6 flex items-center'>
					{/* Track */}
					<View
						ref={sliderRef}
						id='slider'
						className='relative w-full h-2 bg-gray-200 rounded-full cursor-pointer'>
						{/* Active range */}
						<View
							className='absolute h-2 bg-primary rounded-full'
							style={{
								left: `${minPercentage}%`,
								width: `${maxPercentage - minPercentage}%`
							}}
						/>

						{/* Min thumb */}
						<View
							ref={minThumbRef}
							id='min-thumb'
							className={`absolute w-6 h-6 bg-white border-4 border-primary rounded-full cursor-grab transform -translate-y-1/2 top-1/2 transition-transform ${
								isDragging === 'min' ? 'scale-110 cursor-grabbing shadow-lg' : 'hover:scale-105'
							}`}
							style={{ left: `${minPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
							onMouseDown={handleMouseDown('min')}
							onTouchStart={handleTouchStart('min')}
						/>

						{/* Max thumb */}
						<View
							ref={maxThumbRef}
							id='max-thumb'
							className={`absolute w-6 h-6 bg-white border-4 border-primary rounded-full cursor-grab transform -translate-y-1/2 top-1/2 transition-transform ${
								isDragging === 'max' ? 'scale-110 cursor-grabbing shadow-lg' : 'hover:scale-105'
							}`}
							style={{ left: `${maxPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
							onMouseDown={handleMouseDown('max')}
							onTouchStart={handleTouchStart('max')}
						/>
					</View>
				</View>

				{/* Scale indicators */}
				<View className='flex justify-between mt-2 text-xs text-gray-400'>
					<View>{formatPrice(rangeMin)}</View>
					<View>{formatPrice(Math.floor(rangeMin + (rangeMax - rangeMin) * 0.5))}</View>
					<View>{formatPrice(rangeMax)}</View>
				</View>
			</View>

			{/* Input fields */}
			<View className='flex justify-between w-full'>
				<View>
					<Text className='block text-sm font-medium text-gray-700 mb-2'>Valor Mínimo</Text>
					<CustomInput
						type='number'
						min={rangeMin}
						max={maxValue - step}
						value={minValue}
						onChange={e => {
							const value = parseInt(e.target.value)
							if (!isNaN(value)) {
								setMinValue(Math.max(rangeMin, Math.min(value, maxValue - step)))
							}
						}}
					/>
				</View>
				<View>
					<Text className='block text-sm font-medium text-gray-700 mb-2'>Valor Máximo</Text>
					<CustomInput
						type='number'
						min={minValue + step}
						max={rangeMax}
						value={maxValue}
						onChange={e => {
							const value = parseInt(e.target.value)
							if (!isNaN(value)) {
								setMaxValue(Math.max(minValue + step, Math.min(value, rangeMax)))
							}
						}}
					/>
				</View>
			</View>
		</View>
	)
}
