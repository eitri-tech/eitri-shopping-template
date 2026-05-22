import { TrackingService } from 'shopping-vtex-template-shared'

export const sendScreenView = async (friendlyScreenName, screenFilename) => {
	try {
		TrackingService.sendScreenView(friendlyScreenName, screenFilename)
	} catch (e) {
		console.log('Error on TrackingService_old.screenView', e)
	}
}
