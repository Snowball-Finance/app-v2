import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'

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

const lightTheme = responsiveFontSizes(
  createMuiTheme({
    typography: {
      fontFamily: fontFamily.join(','),
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [
            {
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontDisplay: 'swap',
              fontWeight: 400,
              src: `local('Montserrat'),
                            url('/assets/fonts/Montserrat.woff') format('woff')`,
            },
          ],
        },
      },
      MuiCard: {
        root: {
          boxShadow: '1px 2px 5px rgba(117, 115, 115, 20%)',
          borderRadius: 10,
        },
      },
      MuiPaper: {
        rounded: {
          borderRadius: 10,
        },
      },
      MuiListItem: {
        root: {
          '&$selected': {
            backgroundColor: 'rgba(103, 166, 240, 0.12)',
          },
        },
      },
    },
    palette: {
      primary: {
        main: '#0085EB',
      },
      secondary: {
        main: '#B9B9C3',
        contrastText: '#ffffff',
      },
      danger: {
        main: '#eb196e',
      },
      background: {
        default: '#E5E5E5',
        primary: '#FFFFFF',
      },
      text: {
        primary: '#6E6B7B',
        secondary: '#28C76F',
      },
    },
    custom: {
      palette: {
        white: '#FFFFFF',
        lightGrey: '#F8F8F8',
        darkGrey: '#5E5873',
        lightBlue: '#C8E6FE',
        blue: '#1A93F2',
        darkBlue: '#1E2848',
        green: '#28C76F',
        darkGreen: '#2A4428',
        png_orange: '#FF9F43',
        joe_red: '#F2716A',
        snob_blue: '28A2FF',
        s3d_blue: '#1891FC',
        s3f_green: '#39CD33',
        border: '#D8D6DE',
        transparent: {
          snob_blue: 'rgba(103, 166, 240, 0.12)',
          png_orange: 'rgba(255, 107, 0, 0.12)',
          joe_red: 'rgba(242, 113, 106, 0.12)',
          green: 'rgba(40, 199, 111, 0.12)'
        }
      },
      gradient: {
        blue: 'linear-gradient(90deg, #1A93F2 0%, #1E2848 100%)',
        green: 'linear-gradient(90deg, #32CE27 0%, #2A4428 100%)',
        grey: 'linear-gradient(90deg, #969797 0%, #1E2848 100%)',
        red: 'linear-gradient(90deg, #F04242 0%, #1E2848 100%)'
      },
      layout: {
        maxCardWidth: 513,
        maxDesktopWidth: 1040,
        openDrawerWidth: 240,
        closedDrawerWidth: 57,
      },
    },
  })
)

const darkTheme = responsiveFontSizes(
  createMuiTheme({
    typography: {
      fontFamily: fontFamily.join(','),
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          '@font-face': [
            {
              fontFamily: 'Montserrat',
              fontStyle: 'normal',
              fontDisplay: 'swap',
              fontWeight: 400,
              src: `
            local('Montserrat'),
            url('/assets/fonts/Montserrat.woff') format('woff')`,
            },
          ],
        },
      },
      MuiCard: {
        root: {
          boxShadow: '1px 2px 5px rgba(117, 115, 115, 0.2)',
          borderRadius: 10,
        },
      },
    },
    palette: {
      primary: {
        main: '#337ab7',
      },
      secondary: {
        main: '#B9B9C3',
        contrastText: '#ffffff',
      },
      danger: {
        main: '#eb196e',
      },
      background: {
        default: '#1e2644',
        primary: '#1c2132',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#337ab7',
      },
    },
    custom: {
      palette: {
        white: '#FFFFFF',
        lightGrey: '#F8F8F8',
        darkGrey: '#5E5873',
        lightBlue: '#C8E6FE',
        blue: '#1A93F2',
        darkBlue: '#1E2848',
        green: '#28C76F',
        darkGreen: '#2A4428',
        border: '#D8D6DE',
      },
      gradient: {
        blue: 'linear-gradient(90deg, #1A93F2 0%, #1E2848 100%)',
        green: 'linear-gradient(90deg, #32CE27 0%, #2A4428 100%)',
        grey: 'linear-gradient(90deg, #969797 0%, #1E2848 100%)',
        red: 'linear-gradient(90deg, #F04242 0%, #1E2848 100%)'
      },
      layout: {
        maxCardWidth: 513,
        maxDesktopWidth: 1040,
        openDrawerWidth: 240,
        closedDrawerWidth: 57,
      },
    },
  })
)

export { lightTheme, darkTheme }
