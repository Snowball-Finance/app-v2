import { MatomoProvider, createInstance, useMatomo } from '@datapunt/matomo-tracker-react'
import { useRouter } from "next/router";
import { useEffect, useRef } from 'react'


export const AnalyticCategories = {
  investigation: 'investigation',
  ui: "ui",
  link: 'link',
  subTab: 'subTab',
  modal: 'modal',
  wallet: 'wallet',
  error: 'error',
  formSubmit: 'formSubmit'
}
export const AnalyticActions = {
  click: 'click-event',
  wallet: 'wallet',
  addSnob: 'addSnob',
  themeChange: 'themeChange',
  submit: 'submit',
  approve: 'approve',

}







export const createEvent = ({
  category,
  action,
  name,
  value,
  documentTitle,
  href,

}) => {
  return {
    category,
    action,
    name, // optional
    value, // optional, numerical value
    documentTitle, // optional
    href, // optional

  }
}

const urlBase = '//analytics.snowapi.net/'

const instance = createInstance({
  urlBase,
  siteId: '1',
  trackerUrl: `${urlBase}matomo.php`, // optional, default value: `${urlBase}matomo.php`
  srcUrl: `${urlBase}matomo.js`, // optional, default value: `${urlBase}matomo.js`
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: { // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10 // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: { // optional, default value: {}
    // any valid matomo configuration, all below are optional
    disableCookies: false,
    setSecureCookie: process.env.ENVIRONMENT === 'PROD',
    setRequestMethod: 'POST'
  }
})



export const AnalyticsProvider = ({ children }) => {
  return (
    <MatomoProvider value={instance}>
      <Analytics>
        {children}
      </Analytics>
    </MatomoProvider>
  )
}
export const Analytics = ({ children }) => {
  const router = useRouter();
  const initialized = useRef(false)
  const { trackPageView } = useAnalytics()
  if (typeof window !== "undefined" && initialized.current === false) {
    trackPageView({
      href: router.pathname,
    });
    initialized.current = true
  }

  useEffect(() => {
    if (typeof window === undefined) return;
    const handleRouteChange = (url) => {
      trackPageView({
        href: url,
      });
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      if (typeof window === undefined) return;
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);


  return children
}

export const useAnalytics = () => {
  const { trackPageView, trackEvent, pushInstruction } = useMatomo()
  return { trackPageView, trackEvent, pushInstruction }
}

