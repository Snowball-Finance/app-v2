import { memo } from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles(() => ({
  listItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
  }
}));

const ListItem = ({
  title,
  value,
  classes: propClasses = {
    root: '',
    title: '',
    value: '',
  }
}) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.listItem, propClasses.root)}>
      <Typography variant='body2' className={propClasses.title}>
        {title}
      </Typography>
      <Typography className={clsx(classes.value, propClasses.value)}>
        {value}
      </Typography>
    </div>
  );
}

export default memo(ListItem)