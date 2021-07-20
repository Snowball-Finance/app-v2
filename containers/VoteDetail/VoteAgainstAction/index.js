import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

import VoteAgainstIcon from 'components/Icons/VoteAgainstIcon'
import SnowProgressBar from 'components/SnowProgressBar'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import getStatusColor from 'utils/helpers/getStatusColor'

const colors = getStatusColor('failed')
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
    padding: theme.spacing(1.5, 2.5),
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  header: {
    fontWeight: 600,
    marginBottom: theme.spacing(1)
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  voteButton: {
    backgroundColor: colors.backgroundColor,
    fontSize: 12,
    fontWeight: 600,
    color: colors.color,
    textTransform: 'none',
  }
}))

const VoteAgainstAction = () => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <div className={classes.headerContainer}>
        <Typography variant='body1' className={classes.header}>
          Against
        </Typography>
        <Typography variant='body1' className={classes.header}>
          24,161.2561
        </Typography>
      </div>
      <SnowProgressBar
        status='failed'
        value={40}
      />
      <Typography variant='caption'>
        100 Addresses votes against
      </Typography>
      <div className={classes.buttonContainer}>
        <ContainedButton
          className={classes.voteButton}
          size='small'
          disableElevation
          endIcon={<VoteAgainstIcon />}
        >
          Vote against
        </ContainedButton>
      </div>
    </Card>
  )
}

export default memo(VoteAgainstAction)
