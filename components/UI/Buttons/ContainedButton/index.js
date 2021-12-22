
import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, CircularProgress } from '@material-ui/core'
import clsx from 'clsx'

import ButtonLink from 'components/UI/Buttons/ButtonLink'
import { AnalyticActions, AnalyticCategories, analytics, createEvent } from "utils/analytics"

const useStyles = makeStyles(theme => ({
  root: {
    fontSize: 14,
    fontWeight: 'bold',
    borderRadius: 5,
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  wrapper: {
    position: 'relative',
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: `${theme.custom.palette.lightGrey} !important`,
    color: `${theme.custom.palette.darkGrey} !important`,
  }
}));

const ContainedButton = React.forwardRef(({
  className,
  classes: propClasses = {},
  color = 'primary',
  href,
  loading,
  disabled,
  children,
  ...rest
}, ref) => {
  const classes = useStyles();

  const handleClick = () => {
    analytics.trackEvent(createEvent({
      action: AnalyticActions.click,
      ...(rest.href && { name: `${hash}`, }),
      category: rest.href ? AnalyticCategories.link : AnalyticCategories.button,
    }))
    rest.onClick && rest.onClick()
  }

  return (
    <Button
      ref={ref}
      href={href}
      target="_blank"
      component={href ? ButtonLink : 'button'}
      className={clsx(className, classes.root)}
      classes={{
        ...propClasses,
        disabled: classes.disabled
      }}
      color={color}
      variant='contained'
      disabled={loading || disabled}
      startIcon={loading && <CircularProgress size={24} />}
      {...rest}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
});

export default memo(ContainedButton);
