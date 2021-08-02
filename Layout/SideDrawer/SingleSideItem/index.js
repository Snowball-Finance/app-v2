import { memo } from 'react'
import { ListItemIcon, ListItemText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

import ListItemLink from '../ListItemLink'

const useStyles = makeStyles((theme) => ({
  itemIcon: {
    minWidth: 40,
    color: 'transparent',
    stroke: '#55535d',
    '& svg': {
      stroke: '#55535d',
    },
  },
  selected: {
    borderRadius: theme.spacing(0.5),
    background: theme.custom.gradient.lightBlue,
  },
  menuHover: {
    transition: 'transform .25s ease,-webkit-transform .25s ease',
    '&:hover': {
      backgroundColor: theme.palette.background.lightBlue,
      transform: 'translateX(5px)',
      transition: 'transform .25s ease,-webkit-transform .25s ease',
    },
  },
}))

const SingleSideItem = ({ isSelect, sidebar, onTab }) => {
  const classes = useStyles()

  return (
    <div onClick={() => onTab(sidebar.TITLE)}>
      <ListItemLink
        target={sidebar.IS_EXT_LINK ? '_blank' : ''}
        rel={sidebar.IS_EXT_LINK ? 'noreferrer' : ''}
        href={sidebar.HREF}
        className={clsx(classes.menuHover, { [classes.selected]: isSelect })}
      >
        <ListItemIcon className={classes.itemIcon}>
          <sidebar.ICON color="black" size={18} />
        </ListItemIcon>
        <ListItemText primary={sidebar.TITLE} />
      </ListItemLink>
    </div>
  )
}

export default memo(SingleSideItem)
