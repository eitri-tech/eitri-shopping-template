import { useState, useEffect } from 'react'
import { View, Text } from 'eitri-luminus'

export default function Alert(props) {
	const { message, type = 'negative', duration = 3, onDismiss, show } = props
	const [visible, setVisible] = useState(true)

	useEffect(() => {
		if (!show) return
		setVisible(true)
		const timer = setTimeout(() => {
			setVisible(false)
			if (typeof onDismiss === 'function') {
				onDismiss()
			}
		}, duration * 1000)
		return () => clearTimeout(timer)
	}, [duration, show, onDismiss])

	if (!visible || !show) return null

	return (
		<View className='fixed p-8 w-full bottom-0 z-50'>
			<View className='w-full flex justify-center p-3'>
				<Text
					className={`w-full font-bold ${
						type === 'positive' ? 'text-green-700' : type === 'warning' ? 'text-yellow-700' : 'text-red-700'
					}`}>
					{message}
				</Text>
			</View>
			<View bottomInset />
		</View>
	)
}
