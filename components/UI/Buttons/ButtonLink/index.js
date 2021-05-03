
import React, { memo } from 'react'
import Link from 'next/link'

const ButtonLink = React.forwardRef(({
  className,
  href,
  hrefAs,
  children,
  prefetch,
  target
}, ref) => (
  <Link
    href={href}
    as={hrefAs}
    prefetch={prefetch}
  >
    <a className={className} ref={ref} target={target}>
      {children}
    </a>
  </Link>
));

export default memo(ButtonLink);
