
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    padding: theme.spacing(0, 1.5),
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 900,
    textDecoration: 'underline',
  }
}));

const SubTitleItem = ({
  title,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
        <Typography className={classes.subtitle}>
          {title}
        </Typography>
    </div>
  )
}

export default memo(SubTitleItem)