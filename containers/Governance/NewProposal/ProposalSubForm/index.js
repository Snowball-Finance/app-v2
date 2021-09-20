import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography } from '@material-ui/core'
import { Controller } from 'react-hook-form'
import { useWeb3React } from '@web3-react/core'

import SnowTooltip from 'parts/SnowTooltip'
import SnowWalletAccount from 'components/SnowWalletAccount'
import SnowTextField from 'components/UI/TextFields/SnowTextField'
import { minimumVotingPeriod, maximumVotingPeriod } from 'utils/constants/voting-limits'

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
  },
  required: {
    color: 'red'
  }
}))

const ProposalSubForm = ({
  control,
  errors
}) => {
  const classes = useStyles();
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
            as={<SnowTextField endAdornment=" Days"/>}
            name='votingPeriod'
            type='number'
            inputProps={{
              min: minimumVotingPeriod,
              max: maximumVotingPeriod
            }}
            label={
            <>Voting Period
            <Typography variant='subtitle' className={classes.required}> * </Typography>
            <SnowTooltip title="Voting period" text={`How long the community will be able to vote on your proposal.\nMinimum: ${minimumVotingPeriod} days.\nMaximum: ${maximumVotingPeriod} days.`} /> 
            </>
            }
            placeholder='Period of days to vote'
            error={errors.votingPeriod?.message}
            control={control}
            defaultValue={''}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            name='discussURL'
            label={
            <>Discussion URL <SnowTooltip title="Discussion URL" text='Link to the discussion of the proposal. You can see discussions in the Snowball Discord' />  
            </>}
            placeholder='https://discord.com/channels/...'
            control={control}
            defaultValue={''}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            name='documentURL'
            label={
            <>Pros - Cons Document URL <SnowTooltip title="Document URL" text='Link to a document arguing why this proposal is good and the potential downsides. This is optional.' />
            </>}
            placeholder='https://docs.google.com/...'
            control={control}
            defaultValue={''}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

export default memo(ProposalSubForm)
