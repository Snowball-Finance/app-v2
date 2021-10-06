import * as createPalette from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {    
    primary?: string;
    lightBlue?: string;
  }

  interface PaletteOptions {      
    danger?: any;
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface ThemeOptions {
    custom?: any
  }

  interface Theme {
    custom?: any
  }
}