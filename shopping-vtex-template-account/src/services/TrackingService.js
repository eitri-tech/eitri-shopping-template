import { TrackingService } from 'shopping-vtex-template-shared'

export const sendScreenView = async (friendlyScreenName, screenFilename) => {
	try {
		TrackingService.screenView(friendlyScreenName, screenFilename)
	} catch (e) {
		console.log('Error on TrackingService.screenView', e)
	}
}
