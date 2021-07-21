import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography } from '@material-ui/core'
import { Controller } from 'react-hook-form'
import { useWeb3React } from '@web3-react/core'

import CircleHelpIcon from 'components/Icons/CircleHelpIcon'
import SnowWalletAccount from 'components/SnowWalletAccount'
import SnowTextField from 'components/UI/TextFields/SnowTextField'
import SnowSelect from 'components/UI/TextFields/SnowSelect'

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

const PERIOD_TYPES = [
  { VALUE: 1, LABEL: '1 day' },
  { VALUE: 2, LABEL: '2 days' },
  { VALUE: 3, LABEL: '3 days' },
  { VALUE: 4, LABEL: '4 days' }
]

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
            as={<SnowSelect />}
            name='period'
            label={<>Voting Period in days <CircleHelpIcon /> </>}
            placeholder='Period of days to vote'
            error={errors.period?.message}
            options={PERIOD_TYPES}
            control={control}
            defaultValue={''}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            name='discussURL'
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
