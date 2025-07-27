export default function OrderStatusBadge(props) {
	const { statusId, statusDescription, ...rest } = props

	// Mapeamento de status para classes de estilo do Tailwind CSS.
	// Isso centraliza a lógica de estilo e torna o JSX mais limpo.
	const STATUS_STYLES = {
		'cancel': {
			wrapper: 'bg-red-100 border-red-200',
			text: 'text-red-700'
		},
		'on-order-completed': {
			wrapper: 'bg-green-100 border-green-200',
			text: 'text-green-700'
		},
		'payment-approved': {
			wrapper: 'bg-green-100 border-green-200',
			text: 'text-green-700'
		},
		'payment-pending': {
			wrapper: 'bg-yellow-100 border-yellow-200',
			text: 'text-yellow-800'
		},
		'request-cancel': {
			wrapper: 'bg-red-100 border-red-200',
			text: 'text-red-700'
		},
		'canceled': {
			wrapper: 'bg-red-100 border-red-200',
			text: 'text-red-700'
		},
		'waiting-for-authorization': {
			wrapper: 'bg-blue-100 border-blue-200',
			text: 'text-blue-700'
		},
		'authorize-fulfillment': {
			wrapper: 'bg-blue-100 border-blue-200',
			text: 'text-blue-700'
		},
		'window-to-cancel': {
			wrapper: 'bg-red-100 border-red-200',
			text: 'text-red-700'
		},
		'ready-for-invoicing': {
			wrapper: 'bg-blue-100 border-blue-200',
			text: 'text-blue-700'
		},
		'invoice': {
			wrapper: 'bg-blue-100 border-blue-200',
			text: 'text-blue-700'
		},
		'order-created': {
			wrapper: 'bg-blue-100 border-blue-200',
			text: 'text-blue-700'
		}
	}

	const DEFAULT_STYLES = {
		wrapper: 'bg-gray-100 border-gray-200',
		text: 'text-gray-700'
	}

	const styles = STATUS_STYLES[statusId] || DEFAULT_STYLES

	return (
		// O badge agora usa classes do Tailwind para um estilo consistente e responsivo.
		// 'inline-flex' garante que o badge se ajuste ao tamanho do conteúdo.
		<View
			className={`inline-flex items-center justify-center px-2 py-1 border rounded-md ${styles.wrapper}`}
			{...rest}>
			<Text className={`text-xs font-bold whitespace-nowrap ${styles.text}`}>{statusDescription}</Text>
		</View>
	)
}
