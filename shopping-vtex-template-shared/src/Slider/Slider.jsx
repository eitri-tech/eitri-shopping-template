import { useKeenSlider } from './keenslider/react.es'
import { useEffect } from 'react'

export default function Slider(props) {
	const { options, autoPlay, autoPlayTimeout, plugins, children } = props

	const _plugins = plugins || []
	if (autoPlay)
		_plugins.push(slider => {
			let timeout
			let mouseOver = false
			function clearNextTimeout() {
				clearTimeout(timeout)
			}
			function nextTimeout() {
				clearTimeout(timeout)
				if (mouseOver) return
				timeout = setTimeout(() => {
					slider.next()
				}, autoPlayTimeout || 5000)
			}
			slider.on('created', () => {
				slider.container.addEventListener('mouseover', () => {
					mouseOver = true
					clearNextTimeout()
				})
				slider.container.addEventListener('mouseout', () => {
					mouseOver = false
					nextTimeout()
				})
				nextTimeout()
			})
			slider.on('dragStarted', clearNextTimeout)
			slider.on('animationEnded', nextTimeout)
			slider.on('updated', nextTimeout)
		})

	const [sliderRef, instanceRef] = useKeenSlider(options, _plugins)

	useEffect(() => {
		const id = 'keen-slider-injected-style'

		if (window.document.getElementById(id)) return

		const style = window.document.createElement('style')
		style.id = id
		style.innerHTML = `
	  .keen-slider:not([data-keen-slider-disabled]) {
	    align-content: flex-start;
	    display: flex;
	    overflow: hidden;
	    position: relative;
	    -webkit-user-select: none;
	    -moz-user-select: none;
	    -ms-user-select: none;
	    user-select: none;
	    -webkit-touch-callout: none;
	    -khtml-user-select: none;
	    touch-action: pan-y;
	    -webkit-tap-highlight-color: transparent;
	    width: 100%;
	  }

	  .keen-slider:not([data-keen-slider-disabled]) .keen-slider__slide {
	    position: relative;
	    overflow: hidden;
	    width: 100%;
	    min-height: 100%;
	  }

	  .keen-slider:not([data-keen-slider-disabled])[data-keen-slider-reverse] {
	    flex-direction: row-reverse;
	  }

	  .keen-slider:not([data-keen-slider-disabled])[data-keen-slider-v] {
	    flex-wrap: wrap;
	  }
	`
		window.document.head.appendChild(style)
	}, [])

	return (
		<div
			ref={sliderRef}
			className='keen-slider'>
			{children}
		</div>
	)
}
