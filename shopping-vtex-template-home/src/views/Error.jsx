import Eitri from 'eitri-bifrost'
import { GenericError, TrackingService } from 'shopping-vtex-template-shared'
export default function Error() {
	useEffect(() => {
		TrackingService.sendScreenView('Erro', 'Error')
	}, [])

	const navigateToHome = () => {
		Eitri.navigation.navigate({
			path: 'Home'
		})
	}

	return (
		<Page
			title='Erro'
			topInset
			bottomInset>
			<GenericError onPress={navigateToHome} />
		</Page>
	)
}
