import Eitri from 'eitri-bifrost'
import { GenericError } from 'eitri-shopping-montreal-shared'
export default function Error() {
	const navigateToHome = () => {
		Eitri.navigation.navigate({
			path: 'Home'
		})
	}

	return (
		<Page
			topInset
			bottomInset>
			<GenericError onPress={navigateToHome} />
		</Page>
	)
}
