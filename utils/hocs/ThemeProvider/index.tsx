
import React, { memo } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'

import { useDarkMode } from 'contexts/ui-context'
import { lightTheme, darkTheme } from 'styles/theme'
import { ChildrenProps } from 'types'

const ThemeProvider = ({
  children
}: ChildrenProps): JSX.Element => {
  const { darkMode } = useDarkMode();
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  );
};

export default memo(ThemeProvider);
