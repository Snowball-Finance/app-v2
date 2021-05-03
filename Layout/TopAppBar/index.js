import { memo } from 'react'
import { AppBar, Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import Logo from 'components/Logo'
import ThemeButton from './ThemeButton'
import { useCommonStyles } from 'styles/use-styles'

const useStyles = makeStyles((theme) => ({
  appBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    boxShadow: 'none',
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 0
  },
}));

const TopAppBar = () => {
  const classes = useStyles();
  const commonClasses = useCommonStyles();

  return (
    <AppBar
      position='relative'
      className={classes.appBar}
    >
      <Toolbar className={clsx(classes.toolBar, commonClasses.containerWidth)}>
        <Logo isLabel />
        <ThemeButton />
      </Toolbar>
    </AppBar>
  );
};

export default memo(TopAppBar);
