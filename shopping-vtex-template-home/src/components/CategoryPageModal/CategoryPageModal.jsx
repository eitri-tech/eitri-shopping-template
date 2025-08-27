import CollapsableView from './components/CollapsableView'
import SelectableTouchable from './components/SelectableTouchable'
import { Text, View, Radio } from 'eitri-luminus'
import { Loading } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
export default function CategoryPageModal(props) {
	const {
		show,
		onClose,
		facets,
		removeFilter,
		addFilter,
		clearFilters,
		executeSearch,
		facetsLoading,
		listOrdering,
		addOrdering
	} = props
	const { t } = useTranslation()

	return null

	return (
		<Modal
			show={show}
			closeOnPressOut={true}
			transition='background-color 0.5s ease-in-out'
			onClose={onClose}>
			<View
				bottomInset
				borderRadiusRightTop='small'
				borderRadiusLeftTop='small'
				minHeight='70vh'
				width='100vw'
				className='bg-base-100 overflow-scroll'>
				<View className='p-2 mx-1 flex flex flex-row justify-between items-center'>
					<Text>{`${t('categoryPageModal.title')}`}</Text>
					<View
						width='36px'
						height='36px'
						onClick={onClose}
						className='bg-neutral items-center justify-center'>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'>
							<g
								id='SVGRepo_bgCarrier'
								strokeWidth='0'></g>
							<g
								id='SVGRepo_tracerCarrier'
								strokeLinecap='round'
								strokeLinejoin='round'></g>
							<g id='SVGRepo_iconCarrier'>
								{' '}
								<g id='Menu / Close_MD'>
									{' '}
									<path
										id='Vector'
										d='M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18'
										stroke='#000000'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'></path>{' '}
								</g>{' '}
							</g>
						</svg>
					</View>
				</View>
				<View className='mx-1'>
					{facetsLoading ? (
						<Loading inline />
					) : (
						<>
							<View className='p-2 flex flex-wrap'>
								{facets &&
									facets.map(facet =>
										facet.values
											.filter(value => value.selected)
											.map(value => (
												<View
													key={value.value}
													onClick={() => removeFilter(value)}
													width='fit-content'
													className='flex items-center py-1 px-2 bg-primary-content'>
													<Text className='text-base-100 font-bold'>{value.name}</Text>
													<svg
														viewBox='0 0 24 24'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'>
														<g
															id='SVGRepo_bgCarrier'
															strokeWidth='0'></g>
														<g
															id='SVGRepo_tracerCarrier'
															strokeLinecap='round'
															strokeLinejoin='round'></g>
														<g id='SVGRepo_iconCarrier'>
															{' '}
															<g id='Menu / Close_MD'>
																{' '}
																<path
																	id='Vector'
																	d='M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18'
																	stroke='#000000'
																	strokeWidth='2'
																	strokeLinecap='round'
																	strokeLinejoin='round'></path>{' '}
															</g>{' '}
														</g>
													</svg>
												</View>
											))
									)}
							</View>
							{listOrdering && (
								<CollapsableView
									key={listOrdering.key}
									title={listOrdering.title}
									willStartCollapsed={false}
									border='none'
									className='font-light'>
									<View className='flex flex flex-col'>
										{listOrdering.values.map(value => (
											<View
												key={value.id}
												onClick={() =>
													addOrdering({
														key: value.categoryKey,
														value: value.value
													})
												}
												className='flex items-center'>
												<Radio defaultChecked={value.checked} />
												{value.name}
											</View>
										))}
									</View>
								</CollapsableView>
							)}
							{facets &&
								facets.map(facet => (
									<CollapsableView
										key={facet.key}
										title={facet.name}
										willStartCollapsed={false}
										border='none'
										className='font-light'>
										<View className='flex flex flex-col'>
											{facet.values.map(value => (
												<SelectableTouchable
													key={`${facet.key}_${value.value}`}
													categoryKey={value.key}
													name={`${value.name}`}
													value={`${value.value}`}
													removeCategory={removeFilter}
													addCategory={addFilter}
													checked={value.selected}
												/>
											))}
										</View>
									</CollapsableView>
								))}
						</>
					)}
					<View height={120} />
					<View className='fixed bottom-0 left-0 right-0 py-1 px-2 bg-base-100'>
						<View
							width='100%'
							height='48px'
							className='flex justify-center'>
							<View
								onClick={clearFilters}
								className='flex p-2 items-center justify-center border-primary-content border grow-1 bg-base-100'>
								<Text className='text-primary-content'>{t('categoryPageModal.clear')}</Text>
							</View>
							<View
								onClick={executeSearch}
								className='flex p-2 items-center justify-center grow-1 bg-primary-content font-bold'>
								<Text className='text-neutral font-bold'>{t('categoryPageModal.button')}</Text>
							</View>
						</View>
						<View bottomInset />
					</View>
				</View>
			</View>
		</Modal>
	)
}
