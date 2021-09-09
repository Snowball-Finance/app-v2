import React, { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { ClickAwayListener, Drawer, List, Typography } from '@material-ui/core'
import clsx from 'clsx';

import Logo from 'components/Logo'
import SingleSideItem from './SingleSideItem'
import MultiSideItem from './MultiSideItem'
import LINKS from 'utils/constants/links'
import SIDEBAR_MENU from 'utils/constants/sidebar-menu'
import { isEmpty } from 'utils/helpers/utility'
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.custom.layout.openDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerPaper: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.primary,
    boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.17)',
    overflowX: 'hidden',
    padding: theme.spacing(1, 0.5)
  },
  drawerOpen: {
    width: theme.custom.layout.openDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    width: theme.custom.layout.closedDrawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2, 1, 1),
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: theme.spacing(1, 2)
  }
}));

const SideDrawer = ({
  isMobile,
  openDrawer,
  setOpenDrawer
}) => {
  const classes = useStyles();
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState('')
  const { setSortedUserPools } = useCompoundAndEarnContract();

  useEffect(() => {
    for (const item of SIDEBAR_MENU) {
      if (isEmpty(item?.CHILDREN)) {
        if (item.HREF === router.pathname) {
          setSelectedItem(item.TITLE)
          return;
        }
      } else {
        for (const childItem of item.CHILDREN) {
          if (childItem.HREF === router.pathname) {
            setSelectedItem(item.TITLE)
          }
        }
      }
    }
  }, [router])

  const itemHandler = (value, open = false) => {
    if (selectedItem === value) {
      setSelectedItem('')
    } else {
      setSelectedItem(value)
    }

    if (isMobile && value !== 'StableVault') {
      setOpenDrawer(false)
    } else if (open) {
      setOpenDrawer(true)
    }
  }

  const onClickAway = () => {
    if (isMobile) {
      setOpenDrawer(false);
    }
  }

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Drawer
        variant='permanent'
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
      >
        <div className={classes.logo}>
          <Logo isLabel={openDrawer} />
        </div>
        <List>
          {SIDEBAR_MENU.map((sidebar) => {

            if (isEmpty(sidebar?.CHILDREN)) {
              return (
                <React.Fragment key={sidebar.TITLE}>
                  {sidebar.TITLE === LINKS.DOCS.TITLE && openDrawer &&
                    <Typography
                      color='textPrimary'
                      className={classes.subtitle}>
                      HELP
                    </Typography>
                  }
                  <SingleSideItem
                    sidebar={sidebar}
                    isSelect={selectedItem === sidebar.TITLE}
                    onTab={itemHandler}
                  />
                </React.Fragment>
              )
            }

            return (
              <MultiSideItem
                key={sidebar.TITLE}
                isOpen={openDrawer && selectedItem === sidebar.TITLE}
                isSelect={selectedItem === sidebar.TITLE}
                sidebar={sidebar}
                onTab={itemHandler}
              />
            )
          })}
        </List>
      </Drawer>
    </ClickAwayListener>
  );
}

export default memo(SideDrawer)