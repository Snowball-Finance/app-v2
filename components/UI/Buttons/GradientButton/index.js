
import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import ContainedButton from 'components/UI/Buttons/ContainedButton'

const useStyles = makeStyles(theme => ({
  primary: {
    background: `linear-gradient(90deg, ${theme.custom.palette.blue} 0%, ${theme.custom.palette.darkBlue} 100%)`,
  },
  secondary: {
    background: `linear-gradient(90deg, ${theme.custom.palette.green} 0%, ${theme.custom.palette.darkGreen} 100%)`,
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
      className={clsx(className, color === 'primary' ? classes.primary : classes.secondary)}
      {...rest}>
      {children}
    </ContainedButton>
  );
});

export default memo(GradientButton);
