import ReactGA from 'react-ga'
const GA_TRACKING_ID=process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

export const initGA=() => {
	ReactGA.initialize(GA_TRACKING_ID)
	ReactGA.set({page: window.location.pathname})
	ReactGA.pageview(window.location.pathname)
}

export const logPageView=(url) => {
	ReactGA.set({page: url})
	ReactGA.pageview(url)

}

export const logEvent=(category='',action='') => {
	if(category&&action) {
		ReactGA.event({category,action})
	}
}

export const logException=(description='',fatal=false) => {
	if(description) {
		ReactGA.exception({description,fatal})
	}
}