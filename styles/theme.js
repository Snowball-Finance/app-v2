
import {
  createMuiTheme,
  responsiveFontSizes
} from '@material-ui/core/styles'

const fontFamily = [
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
  palette: {
    primary: {
      main: '#232323'
    },
    secondary: {
      main: '#337ab7',
    },
    background: {
      default: '#FFF9FF',
    },
    text: {
      primary: '#232323',
      secondary: '#337ab7',
    },
  },
  custom: {
    palette: {
      white: '#FFFFFF'
    },
    layout: {
      maxDesktopWidth: 1550,
    },
  }
}));

const darkTheme = responsiveFontSizes(createMuiTheme({
  typography: {
    fontFamily: fontFamily.join(',')
  },
  palette: {
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#337ab7',
    },
    background: {
      default: '#1c2132',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#337ab7'
    },
  },
  custom: {
    palette: {
      white: '#FFFFFF'
    },
    layout: {
      maxDesktopWidth: 1550,
    },
  }
}));

export {
  lightTheme,
  darkTheme
};