import { Tracking } from 'shopping-vtex-template-shared'

export const sendPageView = async pageName => {
	Tracking.ga.gtag('event', 'page_view', {
		page_title: `[account] ${pageName}`,
		page_path: pageName
	})
}
