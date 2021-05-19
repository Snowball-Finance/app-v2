
import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import clsx from 'clsx'

import TopAppBar from './TopAppBar'
import SideDrawer from './SideDrawer'
import Footer from './Footer'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: theme.spacing(2),
    marginLeft: theme.custom.layout.closedDrawerWidth,
    [theme.breakpoints.down('xs')]: {
      minWidth: `calc(100vw - ${theme.custom.layout.closedDrawerWidth + 16}px)`,
    },
  },
  openContainer: {
    marginLeft: theme.custom.layout.openDrawerWidth,
  },
  content: {
    flex: '1 0 auto'
  },
}));

const Layout = ({
  children
}) => {
  const classes = useStyles();

  const [openDrawer, setOpenDrawer] = useState(true)

  const drawerHandler = () => {
    setOpenDrawer(prev => !prev);
  };

  const openDrawerHandler = () => {
    setOpenDrawer(true);
  }

  return (
    <main className={classes.root}>
      <SideDrawer
        openDrawer={openDrawer}
        openDraw={openDrawerHandler}
      />
      <div className={clsx(classes.container, { [classes.openContainer]: openDrawer })}>
        <div className={classes.content}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TopAppBar
                openDrawer={openDrawer}
                onDraw={drawerHandler}
              />
            </Grid>
            <Grid item xs={12}>
              {children}
            </Grid>
          </Grid>
        </div>
        <Footer />
      </div>
    </main>
  );
};

export default memo(Layout);
