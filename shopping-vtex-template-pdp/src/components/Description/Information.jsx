import { Spacing, Divisor } from 'shopping-vtex-template-shared'
import { useTranslation } from 'eitri-i18n'
import CollapseWrapper from './components/CollapseWrapper'
export default function Information(props) {
	const { product } = props
	const { t } = useTranslation()

	const buildSpecifications = product => {
		let result = {}
		const isExcluded = name => ['Conteudo Enriquecido', 'sellerId'].includes(name)
		if (product?.allSpecifications) {
			product?.allSpecifications?.forEach(element => {
				if (!isExcluded(element)) {
					result[element] = product[element]
				}
			})
		} else {
			// Quando o produto vem através do intelligenceSearch a forma de pegar as especificações são diferente
			let allSpecifications = product?.specificationGroups?.find(
				group => group.originalName === 'allSpecifications'
			)
			allSpecifications?.specifications.forEach(element => {
				if (!isExcluded(element.name)) {
					result[element.name] = element.values
				}
			})
		}
		return [result]
	}
	const specifications = buildSpecifications(product)

	return (
		<CollapseWrapper
			title={t('information.txtInformation')}
			defaultCollapsed={true}>
			<View>
				{specifications && (
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
			</View>
		</CollapseWrapper>
	)
}
