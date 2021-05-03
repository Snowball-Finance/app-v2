
import { memo } from 'react'
import { ThemeProvider, makeStyles } from '@material-ui/core/styles'

import TopAppBar from './TopAppBar'
import Footer from './Footer'
import theme from 'styles/theme'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    position: 'relative',
  },
  container: {
    flex: '1 0 auto',
  },
}));

const Layout = ({
  children
}) => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <main className={classes.root}>
        <TopAppBar />
        <div className={classes.container}>
          {children}
        </div>
        <Footer />
      </main>
    </ThemeProvider>
  );
};

export default memo(Layout);
