import { memo } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'

import { darkTheme } from 'styles/theme'

const ThemeProvider = ({
  children
}) => {

  return (
    <MuiThemeProvider theme={darkTheme}>
      {children}
    </MuiThemeProvider>
  );
};

export default memo(ThemeProvider);
