
import React, { memo } from 'react'
import Link from 'next/link'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { AnalyticActions, AnalyticCategories, createEvent } from "contexts/analytics";


const ButtonLink = React.forwardRef(({
  className,
  href,
  hrefAs,
  children,
  prefetch,
  target,
  onClick,
}, ref) => {
  const { trackEvent } = useMatomo()


  const handleClick = (e) => {
    trackEvent(createEvent({ action: AnalyticActions.click, category: AnalyticCategories.link, value: href }))
    onClick(e)
  }

  return <Link
    href={href}
    as={hrefAs}
    prefetch={prefetch}
  >
    <a className={className} ref={ref} target={target} onClick={handleClick}>
      {children}
    </a>
  </Link>
});

export default memo(ButtonLink);
