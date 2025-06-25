import { formatAmountInCents } from '../../utils/utils'
import OrderListButton from './OrderListButton'
import ImageCard from '../Image/ImageCard'

export default function OrderProductCard(props) {
	const { delivery, productItems, labelDelivery, labelShowAll, labelHideAll } = props

	const [products, setProducts] = useState(productItems)
	const [showAllItems, setShowAllItems] = useState(false)

	useEffect(() => {
		handleLoadProducts()
	}, [])

	const handleLoadProducts = () => {
		if (!showAllItems) {
			setProducts(productItems.slice(0, 3))
		} else {
			setProducts(productItems)
		}
	}

	const toggleShowAllItems = () => {
		if (!showAllItems) {
			setProducts(productItems)
		} else {
			setProducts(productItems.slice(0, 3))
		}
		setShowAllItems(prev => !prev)
	}

	return (
		<View position='relative'>
			{products &&
				products.map((item, key) => (
					<View
						borderTopWidth={key > 0 ? 'hairline' : 'none'}
						borderColor='neutral-700'
						key={item.uniqueId}
						direction='row'
						padding='extra-small'
						backgroundColor='neutral-100'>
						<ImageCard imageUrl={item.imageUrl} />
						<View
							paddingLeft='nano'
							display='flex'
							direction='column'
							grow={'1'}>
							<View
								direction='column'
								justifyContent='between'
								marginBottom='quark'>
								<View id={item.id}>
									<Text
										textOverflow='ellipsis'
										whiteSpace='wrap'
										lineHeight='medium'
										fontSize='nano'
										color='primary-700'>
										{item.name}
									</Text>
								</View>
							</View>
							<View
								display='flex'
								direction='row'
								justifyContent='between'>
								<Text
									block
									fontSize='nano'
									marginBottom='small'>
									{`${item.quantity} un ${formatAmountInCents(item.price)}`}
								</Text>
								{delivery && (
									<Text
										fontSize='nano'
										marginBottom='small'
										fontWeight='bold'>
										{`${labelDelivery || 'Entrega até'} ${delivery}`}
									</Text>
								)}
							</View>
						</View>
					</View>
				))}
			{productItems.length > 3 && (
				<View marginTop='small'>
					<OrderListButton
						borderColor={'tertiary-700'}
						backgroundColor={'tertiary-700'}
						color={'primary-500'}
						label={!showAllItems ? labelShowAll || 'Ver todos os itens' : labelHideAll || 'Ver Menos'}
						onPress={() => toggleShowAllItems()}
					/>
				</View>
			)}
		</View>
	)
}
