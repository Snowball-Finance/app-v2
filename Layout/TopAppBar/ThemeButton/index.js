import { memo } from 'react'
import { Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useDarkMode } from 'contexts/ui-context'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 34,
    height: 20,
    padding: 0,
    margin: theme.spacing(1, 0),
  },
  switchBase: {
    padding: 4,
    '&$checked': {
      transform: 'translateX(14px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: theme.custom.palette.red,
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: theme.custom.palette.red,
      border: `6px solid ${theme.custom.palette.white}`,
    },
  },
  thumb: {
    width: 12,
    height: 12,
  },
  track: {
    borderRadius: 20,
    backgroundColor: theme.palette.background.default,
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {}
}));

const ThemeButton = () => {
  const classes = useStyles();
  const { darkMode, setDarkMode } = useDarkMode();

  const themeHandler = () => {
    setDarkMode(!darkMode)
  }

  return (
    <Switch
      checked={darkMode}
      onChange={themeHandler}
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
    />
  );
};

export default memo(ThemeButton);
