import { MatomoProvider, createInstance, useMatomo } from '@datapunt/matomo-tracker-react'
import { useRouter } from "next/router";
import { useEffect } from 'react'

export const createEvent = ({
  /**needed */
  category,
  /**needed */
  action,
  /**optional */
  name,
  /**optional */
  value,
  /**optional */
  documentTitle,
  /**optional */
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

export const AnalyticCategories = {
  investigation: 'investigation',
  link: 'link',
  modal: 'modal',
}
export const AnalyticActions = {
  click: 'click-event',
  wallet: 'wallet'
}

const instance = createInstance({
  urlBase: 'https://LINK.TO.DOMAIN',
  siteId: 3,
  userId: 'UID76903202', // optional, default value: `undefined`.
  trackerUrl: 'https://LINK.TO.DOMAIN/tracking.php', // optional, default value: `${urlBase}matomo.php`
  srcUrl: 'https://LINK.TO.DOMAIN/tracking.js', // optional, default value: `${urlBase}matomo.js`
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: { // optional, enabled by default
    active: true, // optional, default value: true
    seconds: 10 // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: { // optional, default value: {}
    // any valid matomo configuration, all below are optional
    disableCookies: true,
    setSecureCookie: true,
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
  const { trackPageView, } = useMatomo()
  if (typeof window !== "undefined") {
    trackPageView({
      href: router.pathname,
    });
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

