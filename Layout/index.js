
import { memo, useEffect, useState } from 'react'
import { Grid, useMediaQuery } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'

import TopAppBar from './TopAppBar'
import SideDrawer from './SideDrawer'
import Footer from './Footer'
import BottomAppBar from './BottomAppBar'

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
      marginLeft: 0
    },
  },
  openContainer: {
    marginLeft: theme.custom.layout.openDrawerWidth,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0
    },
  },
  content: {
    flex: '1 0 auto',
    marginBottom: theme.spacing(2)
  },
}));

const Layout = ({
  children
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { defaultMatches: true });

  const [openDrawer, setOpenDrawer] = useState(true)

  useEffect(() => setOpenDrawer(!isMobile), [isMobile])

  const drawerHandler = () => {
    setOpenDrawer(prev => !prev);
  };

  const openDrawerHandler = () => {
    setOpenDrawer(true);
  }

  const onClickAway = () => {
    if (isMobile) {
      setOpenDrawer(false);
    }
  }

  return (
    <main className={classes.root}>
      {(openDrawer || !isMobile) &&
        <SideDrawer
          openDrawer={openDrawer}
          openDraw={openDrawerHandler}
          onClickAway={onClickAway}
        />
      }
      <div className={clsx(classes.container, { [classes.openContainer]: openDrawer })}>
        <div className={classes.content}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TopAppBar
                isMobile={isMobile}
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
      <BottomAppBar />
    </main>
  );
};

export default memo(Layout);
