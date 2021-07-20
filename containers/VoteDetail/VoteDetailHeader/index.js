import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

import StatusLabel from 'parts/Vote/StatusLabel'
import ProposalTime from 'parts/Vote/ProposalTime'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(4, 2.5),
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  container: {
    margin: theme.spacing(1, 0)
  },
  title: {
    fontWeight: 600,
    marginBottom: theme.spacing(0.5)
  }
}))

const VoteDetailHeader = () => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <div className={classes.container}>
        <Typography variant='body1' className={classes.title}>
          Sherpa distribution
        </Typography>
        <StatusLabel status='active' label='Active' />
      </div>
      <ProposalTime address='0x37b5d2EE45d4195bF70dd0cAa46ff0A5803cDFD4' />
    </Card>
  )
}

export default memo(VoteDetailHeader)
