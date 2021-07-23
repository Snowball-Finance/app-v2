import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography } from '@material-ui/core'
import { Controller } from 'react-hook-form'
import { useWeb3React } from '@web3-react/core'

import CircleHelpIcon from 'components/Icons/CircleHelpIcon'
import SnowWalletAccount from 'components/SnowWalletAccount'
import SnowTextField from 'components/UI/TextFields/SnowTextField'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1.5, 2.5),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}))

const ProposalSubForm = ({
  control,
  errors
}) => {
  const classes = useStyles()
  const { account } = useWeb3React();

  return (
    <Card className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} className={classes.header}>
          <Typography variant='body1'>
            Proposed by
          </Typography>
          <SnowWalletAccount account={account} />
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            name='votingPeriod'
            type='number'
            inputProps={{
              min: 1,
              max: 30
            }}
            label={<>Voting Period in days <CircleHelpIcon /> </>}
            placeholder='Period of days to vote'
            error={errors.votingPeriod?.message}
            control={control}
            defaultValue={''}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            name='metadata'
            label={<>Discuss URL <CircleHelpIcon /> </>}
            placeholder='https://discord.gg/tDuuf12'
            control={control}
            defaultValue={''}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            name='documentURL'
            label={<>Pros - Cons Document URL <CircleHelpIcon /> </>}
            placeholder='https://docs.google.com/tDuu'
            control={control}
            defaultValue={''}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default memo(ProposalSubForm)
