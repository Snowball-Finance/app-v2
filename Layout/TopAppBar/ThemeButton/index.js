import { memo } from 'react'
import { IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useDarkMode } from 'contexts/ui-context'
import DarkThemeIcon from 'components/Icons/DarkThemeIcon'
import LightThemeIcon from 'components/Icons/LightThemeIcon'

const useStyles = makeStyles((theme) => ({
  theme: {
    backgroundColor: theme.palette.text.secondary
  },
}));

const ThemeButton = () => {
  const classes = useStyles();
  const { darkMode, setDarkMode } = useDarkMode();

  const themeHandler = () => {
    setDarkMode(!darkMode)
  }

  return (
    <IconButton
      className={classes.theme}
      onClick={themeHandler}
    >
      {darkMode
        ? <LightThemeIcon />
        : <DarkThemeIcon />
      }
    </IconButton>
  );
};

export default memo(ThemeButton);
