import eyeOn from '../../assets/images/eye-on.svg'
import eyeOff from '../../assets/images/eye-off.svg'

export default function CustomInput(props) {
	const { icon, type, backgroundColor, width, label, height, onChange, value, ...rest } = props

	const [showPassword, setShowPassword] = useState(false)

	return (
		<View className={`${width ? `w-[${width}]` : 'w-full'}`}>
			{label && (
				<View className='mb-1'>
					<Text className='text-xs font-bold'>{label}</Text>
				</View>
			)}
			<View className={``}>
				<TextInput
					className={`w-full rounded-none border-gray-300 border-solid border-2 focus:outline-none focus:ring-0`}
					type={showPassword ? 'text' : type || 'text'}
					onChange={onChange}
					value={value}
					{...rest}
				/>
				{type === 'password' && (
					<View>
						<Image src={showPassword ? eyeOn : eyeOff} />
					</View>
				)}
			</View>
		</View>
	)
}
