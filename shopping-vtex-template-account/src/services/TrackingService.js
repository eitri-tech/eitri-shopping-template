import { TrackingService } from 'eitri-shopping-montreal-shared'

export const sendScreenView = async (friendlyScreenName, screenFilename) => {
	try {
		TrackingService.screenView(friendlyScreenName, screenFilename)
	} catch (e) {
		console.log('Error on TrackingService.screenView', e)
	}
}
