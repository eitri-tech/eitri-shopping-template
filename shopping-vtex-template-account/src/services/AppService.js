import { App } from 'eitri-shopping-vtex-shared'

export const startConfigure = async () => {
	await App.tryAutoConfigure({ verbose: true, gaVerbose: false })
}
