import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const SCRIPT_ID = 'recaptcha-v3-script'

const loadRecaptchaScript = (siteKey) => {
	return new Promise((resolve, reject) => {
		if (document.getElementById(SCRIPT_ID)) {
			if (window.grecaptcha) {
				window.grecaptcha.ready(() => resolve())
			} else {
				resolve()
			}
			return
		}

		const script = document.createElement('script')
		script.id = SCRIPT_ID
		script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
		script.async = true
		script.defer = true
		script.onload = () => {
			window.grecaptcha.ready(() => resolve())
		}
		script.onerror = () => reject(new Error('Failed to load reCAPTCHA script'))
		document.head.appendChild(script)
	})
}

const Recaptcha = forwardRef((props, ref) => {
	const { onRecaptchaReady, siteKey } = props
	const siteKeyRef = useRef(siteKey)

	useEffect(() => {
		siteKeyRef.current = siteKey
	}, [siteKey])

	useEffect(() => {
		if (!siteKey) return
		loadRecaptchaScript(siteKey)
			.then(() => {
				if (onRecaptchaReady) onRecaptchaReady()
			})
			.catch((error) => {
				console.error(error)
			})
	}, [siteKey])

	useImperativeHandle(ref, () => {
		return {
			async getRecaptchaToken() {
				try {
					const token = await window.grecaptcha.execute(siteKeyRef.current, { action: 'submit' })
					return token
				} catch (e) {
					console.error(e)
				}
			}
		}
	})

	return null
})

Recaptcha.displayName = 'Recaptcha'

export default Recaptcha
