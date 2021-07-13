import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  listItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 14,
    paddingRight: theme.spacing(1)
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
      <div className={clsx(classes.title, propClasses.title)}>
        {title}
      </div>
      <div className={clsx(classes.value, propClasses.value)}>
        {value}
      </div>
    </div>
  );
}

export default memo(ListItem)