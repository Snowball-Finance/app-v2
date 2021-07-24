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

const VoteDetailInfo = ({
  proposal
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <Typography variant='caption' className={classes.info}>
        {proposal?.detail || 'No detail'}
      </Typography>
    </Card>
  )
}

export default memo(VoteDetailInfo)
