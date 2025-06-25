import Eitri from 'eitri-bifrost'
import OrderStatusBadge from './OrderStatusBadge'

export default function OrderListDetails(props) {
	const {
		creationDate,
		totalItems,
		totalValue,
		statusId,
		statusDescription,
		order,
		labelOrderDate,
		labelTotal,
		labelOrderNumber
	} = props

	const [colorButtonCopy, setColorButtonCopy] = useState('neutral-900')

	const copyOrderNumber = async orderNumber => {
		await Eitri.clipboard.setText({
			text: orderNumber
		})
		setColorButtonCopy('positive-700')
	}

	return (
		<View
			padding='small'
			justifyContent='between'
			display='flex'
			direction='column'
			borderBottomWidth='hairline'
			borderColor='neutral-300'>
			<View
				display='flex'
				width='100%'
				direction='row'>
				<View
					align='left'
					display='flex'
					width='100%'
					direction='column'>
					<Text
						block
						fontSize='nano'
						marginBottom='quark'
						fontWeight='bold'>
						{labelOrderDate || 'Data do Pedido'}
					</Text>
					<Text
						block
						fontSize='nano'
						marginBottom='small'>
						{creationDate}
					</Text>
				</View>
				<View
					align='left'
					display='flex'
					width='100%'
					direction='column'>
					<Text
						block
						textAlign='right'
						marginBottom='quark'
						fontSize='nano'
						fontWeight='bold'>
						{labelTotal || 'Total'}
					</Text>
					<Text
						block
						textAlign='right'
						marginBottom='quark'
						fontSize='nano'>
						{totalValue}
					</Text>
				</View>
			</View>

			<View
				display='flex'
				direction='row'
				alignItems='center'>
				<View paddingRight='nano'>
					<Text
						block
						fontSize='nano'
						marginBottom='quark'
						fontWeight='bold'>
						{labelOrderNumber || 'Número do Pedido'}
					</Text>
					<Text
						block
						fontSize='nano'
						marginBottom='quark'
						whiteSpace='nowrap'>
						{order}
					</Text>
				</View>
				<View onPress={() => copyOrderNumber(order)}>
					{/*<Icon*/}
					{/*	iconKey='clipboard'*/}
					{/*	color={colorButtonCopy}*/}
					{/*	width={25}*/}
					{/*/>*/}
				</View>
			</View>
			<View
				display='flex'
				direction='row'
				alignItems='center'
				justifyContent='between'>
				<Text> {`${totalItems} ${totalItems > 1 ? 'Itens' : 'Item'}`}</Text>
				<OrderStatusBadge
					statusId={statusId}
					statusDescription={statusDescription}
				/>
			</View>
		</View>
	)
}
