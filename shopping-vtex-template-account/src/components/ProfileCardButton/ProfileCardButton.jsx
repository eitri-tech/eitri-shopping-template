import { Image } from 'eitri-luminus'
import userIcon from '../../assets/icons/user.svg'
import bookmarkIcon from '../../assets/images/bookmark-01.svg'
import boxIcon from '../../assets/images/box-01.svg'
import arrowRightIcon from '../../assets/icons/arrow-left.svg'

export default function ProfileCardButton(props) {
	const { icon, label, onClick } = props

	const getIcon = iconName => {
		switch (iconName) {
			case 'user':
				return (
					<Image
						src={userIcon}
						width={24}
						height={24}
					/>
				)
			case 'bookmark':
				return (
					<Image
						src={bookmarkIcon}
						width={24}
						height={24}
					/>
				)
			case 'package':
				return (
					<Image
						src={boxIcon}
						width={24}
						height={24}
					/>
				)
			default:
				return (
					<Image
						src={userIcon}
						width={24}
						height={24}
					/>
				)
		}
	}

	return (
		<View
			className='flex flex-row items-center justify-between w-full bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-4 mb-3'
			onClick={onClick}>
			<View className='flex flex-row items-center gap-3'>
				{getIcon(icon)}
				<Text className='text-gray-900 text-base font-medium'>{label}</Text>
			</View>
			<View>
				<Image
					src={arrowRightIcon}
					width={20}
					height={20}
				/>
			</View>
		</View>
	)
}
