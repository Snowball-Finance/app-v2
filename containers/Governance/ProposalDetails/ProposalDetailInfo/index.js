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
    marginBottom: theme.spacing(2),
    wordWrap: "break-word"
  }
}))

const ProposalDetailInfo = ({
  proposal
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <Typography variant='caption' className={classes.info}>
        {proposal?.metadata?.description || 'No details given'}
      </Typography>
    </Card>
  )
}

export default memo(ProposalDetailInfo)
