
import {
  createMuiTheme,
  responsiveFontSizes
} from '@material-ui/core/styles'

const fontFamily = [
  'Montserrat',
  'Rubik',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
]

const lightTheme = responsiveFontSizes(createMuiTheme({
  typography: {
    fontFamily: fontFamily.join(',')
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [{
          fontFamily: 'Montserrat',
          fontStyle: 'normal',
          fontDisplay: 'swap',
          fontWeight: 400,
          src: `
            local('Montserrat'),
            url('/assets/fonts/Montserrat.woff') format('woff')`
        }],
      }
    },
    MuiCard: {
      root: {
        borderRadius: 6,
      }
    },
  },
  palette: {
    primary: {
      main: '#0085EB'
    },
    secondary: {
      main: '#B9B9C3',
      contrastText: '#ffffff'
    },
    background: {
      default: '#E5E5E5',
      primary: '#FFFFFF',
    },
    text: {
      primary: '#5e5873',
      secondary: '#28C76F',
    },
  },
  custom: {
    palette: {
      white: '#FFFFFF',
      green: '#28C76F'
    },
    layout: {
      maxDesktopWidth: 1550,
      openDrawerWidth: 240,
      closedDrawerWidth: 57
    },
  }
}));

const darkTheme = responsiveFontSizes(createMuiTheme({
  typography: {
    fontFamily: fontFamily.join(',')
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [{
          fontFamily: 'Montserrat',
          fontStyle: 'normal',
          fontDisplay: 'swap',
          fontWeight: 400,
          src: `
            local('Montserrat'),
            url('/assets/fonts/Montserrat.woff') format('woff')`
        }],
      }
    },
    MuiCard: {
      root: {
        borderRadius: 6,
      }
    },
  },
  palette: {
    primary: {
      main: '#337ab7',
    },
    secondary: {
      main: '#B9B9C3',
      contrastText: '#ffffff'
    },
    background: {
      default: '#1e2644',
      primary: '#1c2132',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#337ab7'
    },
  },
  custom: {
    palette: {
      white: '#FFFFFF',
      green: '#28C76F'
    },
    layout: {
      maxDesktopWidth: 1550,
      openDrawerWidth: 240,
      closedDrawerWidth: 57
    },
  }
}));

export {
  lightTheme,
  darkTheme
};