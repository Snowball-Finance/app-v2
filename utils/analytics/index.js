import MatomoTracker from '@datapunt/matomo-tracker-js'

export const AnalyticCategories = {
  investigation: 'investigation',
  ui: "ui",
  link: 'link',
  button: 'button',
  subTab: 'subTab',
  modal: 'modal',
  wallet: 'wallet',
  error: 'error',
  formSubmit: 'formSubmit',
  s4d: 's4d',
  s3d: 's3d',
  s3f: 's3f',
  transaction: 'transaction',
}
export const AnalyticActions = {
  click: 'click-event',
  wallet: 'wallet',
  addSnob: 'addSnob',
  themeChange: 'themeChange',
  submit: 'submit',
  approve: 'approve',
  add: 'add',
  s4d: 's4d',
  s3d: 's3d',
  s3f: 's3f',
  remove: 'remove',
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
const urlBase = (() => {
  if (process.env.ANALYTICS_ENDPOINT) {
    return process.env.ANALYTICS_ENDPOINT
  }
  throw new Error("No analytics endpoint defined in environment variables, please define ANALYTICS_ENDPOINT")
})()

const siteId = (() => {
  if (process.env.ANALYTICS_SITE_ID) {
    return Number(process.env.ANALYTICS_SITE_ID)
  }
  throw new Error("No analytics site id defined in environment variables, please define ANALYTICS_SITE_ID")
})()

export const analytics = new MatomoTracker({
  urlBase,
  siteId,
})