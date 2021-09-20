import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Grid } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

import StateLabel from 'parts/Vote/StateLabel'
import getEllipsis from 'utils/helpers/getEllipsis'
import { getEnglishDate } from 'utils/helpers/time'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  headerLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.custom.palette.blue,
    marginLeft: theme.spacing(0.5)
  },
  propose: {
    fontSize: 10,
    padding: theme.spacing(0.5, 0)
  }
}))

const ProposalTime = ({
  proposal
}) => {
  const classes = useStyles()

  const headerLabel = useMemo(() => {
    switch (proposal.state) {
      case 'Active':
        return 'Voting finish at'
      case 'Defeated':
        return 'Defeated'
      case 'Pending Execution':
        return 'Pending Execution'
      case 'Ready For Execution':
        return 'Ready For Execution'
      case 'Executed':
        return 'Executed'
      case 'Vetoed':
        return 'Canceled'
      default:
        return 'Voting finish at'
    }
  }, [proposal.state]);

  return (
    <div className={classes.root}>
      <Grid container>
      <Typography
        variant='caption'
        className={classes.headerLabel}
      >
        {headerLabel}
        <HelpOutlineIcon className={classes.helpIcon} />
      </Typography>
      <StateLabel
        size={12}
        state={proposal.state}
        label={getEnglishDate(proposal.endDate)}
      />
      {proposal.proposer &&
        <Grid item>
          <Typography
            variant='caption'
            className={classes.propose}
          >
            {`Proposed by ${getEllipsis(proposal.proposer)}`}
          </Typography>
        </Grid>
      }
      </Grid>
    </div>
  )
}

export default memo(ProposalTime)
