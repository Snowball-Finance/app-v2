import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography, Divider } from '@material-ui/core'

import DiscordIcon from 'components/Icons/DiscordIcon'
import ExternalLinkIcon from 'components/Icons/ExternalLinkIcon'
import ClockIcon from 'components/Icons/ClockIcon'
import { getEnglishDateWithTime } from 'utils/helpers/time'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1.5, 2.5),
  },
  link: {
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'unset',
    color: theme.palette.text.primary,
    '& span': {
      padding: theme.spacing(0, 1)
    }
  },
  divider: {
    height: 1,
  },
  timeContainer: {
    display: 'flex'
  },
  time: {
    fontSize: 14,
    marginLeft: theme.spacing(1),
    '& span': {
      fontWeight: 'bold'
    }
  }
}))

const VoteMetaInfo = ({
  proposal
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <a aria-label='discord' href={proposal.metadata} className={classes.link} target='_blank' rel='noreferrer'>
            <DiscordIcon />
            <span>Discuss of proposal in Discord</span>
            <ExternalLinkIcon />
          </a>
        </Grid>
        <Grid item xs={12}>
          <Divider
            flexItem
            orientation="horizontal"
            className={classes.divider}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.timeContainer}>
            <ClockIcon />
            <Typography className={classes.time}>
              Start voting at<br />
              <span>
                {getEnglishDateWithTime(proposal.startDate)}
              </span>
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.timeContainer}>
            <ClockIcon />
            <Typography className={classes.time}>
              End voting at<br />
              <span>
                {getEnglishDateWithTime(proposal.endDate)}
              </span>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Card>
  )
}

export default memo(VoteMetaInfo)
