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

const ProposalDetailInfo = ({
  proposal
}) => {
  const classes = useStyles()
  const lines = proposal.metadata?.description.split('\n')
  return (
    <Card className={classes.root}>
       {lines 
          ? (
            lines.map((line, i) => (
              <span key={i}>
                  {line}
                  <br/>
              </span>
            ))
          ) : (
            <Typography variant='caption' className={classes.info}>
            No Details Given
            </Typography>
          )
        }
    </Card>
  )
}

export default memo(ProposalDetailInfo)
