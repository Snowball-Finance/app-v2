import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

import StatusLabel from 'parts/Vote/StatusLabel'

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
  }
}))

const ProposalTime = ({
  status = 'active'
}) => {
  const classes = useStyles()

  const headerLabel = useMemo(() => {
    switch (status) {
      case 'active':
        return 'Voting finish at'
      case 'executed':
        return 'Execured'
      case 'failed':
        return 'Canceled'
      default:
        return 'Voting finish at'
    }
  }, [status]);

  return (
    <div className={classes.root}>
      <Typography
        variant='caption'
        className={classes.headerLabel}
      >
        {headerLabel}
        <HelpOutlineIcon className={classes.helpIcon} />
      </Typography>
      <StatusLabel
        size={12}
        status={status}
        label='2 days, 7 hours left'
      />
    </div>
  )
}

export default memo(ProposalTime)
