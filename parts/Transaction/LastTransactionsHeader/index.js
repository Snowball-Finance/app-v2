
import { memo } from 'react'
import {
  Divider,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2)
  },
  date: {
    fontSize: 14,
    '& span': {
      fontSize: 20,
      fontWeight: 'bold'
    }
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    '& span': {
      fontSize: 14,
      fontWeight: 'normal',
    }
  },
  divider: {
    width: 1,
    margin: theme.spacing(0.5, 2)
  },
}));

const LastTransactionsHeader = ({
  title
}) => {
  const classes = useStyles();

  return (
    <div className={classes.headerContainer}>
      <Typography
        color='textPrimary'
        align='center'
        className={classes.date}
      >
        {moment().format('ddd')}
        <br />
        <span>{moment().date()}</span>
      </Typography>
      <Divider
        flexItem
        orientation='vertical'
        className={classes.divider}
      />
      <Typography
        color='textPrimary'
        className={classes.title}
      >
        Last transactions
        <br />
        <span>{title}</span>
      </Typography>
    </div>
  )
}

export default memo(LastTransactionsHeader);