
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

const theme = responsiveFontSizes(createMuiTheme({
  typography: {
    fontFamily: fontFamily.join(',')
  },
  palette: {
    primary: {
      main: '#FFFFFF',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#19857b',
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

export default theme;
