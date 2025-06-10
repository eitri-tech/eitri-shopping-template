import { Spacing, Divisor } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
export default function Information(props) {
	const { specifications } = props
	const [collapsed, setCollapsed] = useState(true)
	const { t } = useTranslation()
	const toggleCollapsedState = () => {
		setCollapsed(!collapsed)
	}
	return (
		<View>
			{specifications && (
				<View>
					<View onClick={() => toggleCollapsedState()}>
						<View className='flex items-center justify-between w-full'>
							<Text className='text-lg font-bold'>{t('information.txtInformation')}</Text>
							<View>{/* <Icon iconKey={collapsed ? 'chevron-down' : 'chevron-up'} width={26} /> */}</View>
						</View>
					</View>
					{!collapsed && (
						<View>
							{specifications.map((specification, index) => (
								<View key={index}>
									{Object.entries(specification).map(([key, value]) => (
										<View
											key={key}
											className='mb-1'>
											<View>
												<Text className='font-bold text-neutral-content mr-1'>{`${key}: `}</Text>
											</View>
											{value.length > 1 ? (
												<View>
													{value.map((item, index) => (
														<View
															key={index}
															className='flex flex-col'>
															<Text className='mr-1'>{item}</Text>
														</View>
													))}
												</View>
											) : (
												<Text>{value}</Text>
											)}
										</View>
									))}
								</View>
							))}
							<Spacing height='20px' />
						</View>
					)}
					<Divisor />
				</View>
			)}
		</View>
	)
}
