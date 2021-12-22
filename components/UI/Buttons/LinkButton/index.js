
import React, { memo } from 'react'
import Link from 'next/link'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { AnalyticActions, AnalyticCategories, createEvent, analytics } from "utils/analytics";


import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.text.primary,
    '&:hover': {
      textDecoration: 'underline',
    }
  }
}));

const LinkButton = ({
  className,
  href,
  as,
  target = '',
  onClick = () => { },
  children
}) => {
  const classes = useStyles();

  const handleClick = (e) => {
    analytics.trackEvent(createEvent({ action: AnalyticActions.click, category: AnalyticCategories.link, value: href ? href : '' }))
    onClick && onClick(e)
  }

  return href
    ? (
      <Link
        as={as}
        href={href}
        onClick={handleClick}
      >
        <a
          target={target}
          className={clsx(classes.root, className)}
        >
          {children}
        </a>
      </Link>
    ) : (
      <Typography
        className={clsx(classes.root, className)}
        onClick={handleClick}
      >
        {children}
      </Typography>
    )
};

export default memo(LinkButton);