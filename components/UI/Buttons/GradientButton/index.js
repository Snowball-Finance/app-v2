
import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import ContainedButton from 'components/UI/Buttons/ContainedButton'

const useStyles = makeStyles(theme => ({
  primary: {
    background: theme.custom.gradient.blue,
  },
  secondary: {
    background: theme.custom.gradient.green,
  },
  grey: {
    background: theme.custom.gradient.grey,
  },
  red: {
    background: theme.custom.gradient.red,
  }
}));

const GradientButton = React.forwardRef(({
  color = 'primary',
  className,
  children,
  ...rest
}, ref) => {
  const classes = useStyles();

  return (
    <ContainedButton
      ref={ref}
      className={clsx(className, classes[color])}
      {...rest}>
      {children}
    </ContainedButton>
  );
});

export default memo(GradientButton);
