
import React, { memo } from 'react'
import Link from 'next/link'
import { AnalyticActions, AnalyticCategories, createEvent, analytics } from "utils/analytics";


const ButtonLink = React.forwardRef(({
  className,
  href,
  hrefAs,
  children,
  prefetch,
  target,
  onClick,
}, ref) => {
  const handleClick = (e) => {
    trackEvent(createEvent({ action: AnalyticActions.click, category: AnalyticCategories.link, value: href }))
    onClick && onClick(e)
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
