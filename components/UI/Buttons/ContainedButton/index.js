
import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, CircularProgress } from '@material-ui/core'
import clsx from 'clsx'

import ButtonLink from 'components/UI/Buttons/ButtonLink'

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
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
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

  return (
    <div className={classes.wrapper}>
      <Button
        ref={ref}
        href={href}
        component={href ? ButtonLink : 'button'}
        className={clsx(className, classes.root)}
        classes={{
          ...propClasses,
          disabled: classes.disabled
        }}
        color={color}
        variant='contained'
        disabled={loading || disabled}
        {...rest}
      >
        {children}
      </Button>
      {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
});

export default memo(ContainedButton);
