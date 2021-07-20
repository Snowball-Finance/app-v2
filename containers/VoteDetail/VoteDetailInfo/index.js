import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1.5, 2.5),
  },
  info: {
    marginBottom: theme.spacing(2)
  }
}))

const VoteDetailInfo = () => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <Typography variant='caption' className={classes.info}>
        The vote to purchase $40k USD worth of SHERPA tokens at
        $0.15 each passed the other day. This leaves us with 266,666
        SHERPA to distribute.
      </Typography>
      <Typography variant='caption' className={classes.info}>
        The original proposal called for a distribution to xSNOB
        holders; however, I would like to explore other additional
        avenues of distribution. My concern with distributing only
        to xSNOB holders is that there are other places we can distribute,
        which will probably lead to better tangible benefits and adoption.
      </Typography>
      <Typography variant='caption' className={classes.info}>
        Distributing the entire SHERPA allotment only to xSNOB 
        holders makes locking SNOB for xSNOB more popular. 
        This should increase the value of the SNOB token because 
        the supply is decreasing. However, as we’ve seen over 
        the past month, even though over 3.5 million SNOB has 
        been locked for an average of over 1 year, the price 
        of SNOB has only depreciated heavily.
      </Typography>
    </Card>
  )
}

export default memo(VoteDetailInfo)
