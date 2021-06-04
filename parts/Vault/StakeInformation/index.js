
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
  },
  header: {
    fontWeight: 'bold',
  },
  infoContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: theme.spacing(1.5)
  },
  value: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  withdrawButton: {
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'unset',
    borderRadius: 6,
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
  stakeButton: {
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'unset',
    borderRadius: 6,
  },
}));

const StakeInformation = ({
  type = 's3d',
  availableStake,
  staked,
  onWithdraw,
  onStake
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography className={classes.header}>
            Stake information
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.infoContainer}>
            <Typography variant='body2'>
              Available to stake:
            </Typography>
            <Typography variant='body2' className={classes.value}>
              {`${availableStake.toLocaleString()} ${type}`}
            </Typography>
          </div>
          <div className={classes.infoContainer}>
            <Typography variant='body2'>
              Staked:
            </Typography>
            <Typography variant='body2' className={classes.value}>
              {`${staked.toLocaleString()} ${type}`}
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <ContainedButton
            disabled={!staked}
            className={classes.withdrawButton}
            onClick={onWithdraw}
          >
            Withdraw
          </ContainedButton>
          <ContainedButton
            disabled={!availableStake}
            className={classes.stakeButton}
            onClick={onStake}
          >
            {`Stake ${type}`}
          </ContainedButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default memo(StakeInformation)