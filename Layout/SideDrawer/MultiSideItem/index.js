import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
  Grid
} from '@material-ui/core'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import clsx from 'clsx';

import {Circle} from 'react-feather';
import ListItemLink from '../ListItemLink'

const useStyles = makeStyles((theme) => ({
  itemIcon: {
    minWidth: 40,
    color: theme.palette.primary.main
  },
  nestedItemIcon: {
    minWidth: 40,
    padding: theme.spacing(0, 0.25)
  },
  circle: {
    color: theme.palette.text.primary
  },
  selected: {
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.background.default,
  },
  new: {
    color: theme.custom.palette.white,
    backgroundColor: theme.custom.palette.green
  },
  deprecated: {
    color: theme.custom.palette.white,
    backgroundColor: theme.custom.palette.joe_red
  }
}));

const MultiSideItem = ({
  isOpen,
  isSelect,
  sidebar,
  onTab,
  onClickAway,
}) => {
  const classes = useStyles();

  return (
    <>
      <ListItem
        button
        onClick={() => onTab(sidebar.TITLE, true)}
        className={clsx({ [classes.selected]: isSelect })}
      >
        <ListItemIcon className={classes.itemIcon}>
          <sidebar.ICON />
        </ListItemIcon>
        <ListItemText primary={sidebar.TITLE} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {sidebar?.CHILDREN.map((item) => (
            <ListItemLink
              key={item.TITLE}
              target={item?.IS_EXT_LINK ? '_blank' : ''}
              rel={item?.IS_EXT_LINK ? 'noreferrer' : ''}
              onClick={onClickAway}
              href={item.HREF}
            >
              <Grid container justify='space-between' alignItems='center'>
                <Grid item xs={2}>
                  <ListItemIcon className={classes.nestedItemIcon}>
                    <Circle size={15} className={classes.circle}/>
                  </ListItemIcon>
                </Grid>

                <Grid item xs={5}>
                  <ListItemText primary={item.TITLE} />
                </Grid>

                <Grid item xs={5}>
                  {item?.IS_NEW &&
                    <Chip size='small' className={classes.new} label='New' />
                  }
                  {item?.IS_DEPRECATED &&
                    <Chip size='small' className={classes.deprecated} label='Deprecated' />
                  }
                </Grid>
              </Grid>
            </ListItemLink>
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default memo(MultiSideItem)