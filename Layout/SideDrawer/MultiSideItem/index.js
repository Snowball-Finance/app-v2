import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse
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
  selected: {
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.background.default,
  },
  new: {
    fontSize: 12,
    borderRadius: 30,
    padding: theme.spacing(0, 1),
    color: theme.custom.palette.white,
    backgroundColor: theme.custom.palette.green
  },
  deprecated: {
    fontSize: 12,
    borderRadius: 30,
    padding: theme.spacing(0, 1),
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
              <ListItemIcon className={classes.nestedItemIcon}>
                <Circle size={15}/>
              </ListItemIcon>
              <ListItemText primary={item.TITLE} />
              {item?.IS_NEW &&
                <Typography className={classes.new}>New</Typography>
              }
              {item?.IS_DEPRECATED &&
                <Typography className={classes.deprecated}>Deprecated</Typography>
              }
            </ListItemLink>
          ))}
        </List>
      </Collapse>
    </>
  );
}

export default memo(MultiSideItem)