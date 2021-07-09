
import { memo } from 'react'
import { Grid } from '@material-ui/core'

import { useStakingContract } from 'contexts/staking-context'
import CardWrapper from '../CardWrapper'
import CreateLock from './CreateLock'
import IncreaseAmount from './IncreaseAmount'
import IncreaseTime from './IncreaseTime'
import Withdraw from './Withdraw'

const LockForm = () => {
  const {
    lockedAmount,
    isExpired,
  } = useStakingContract();

  return (
    <CardWrapper title='Lock Snowballs for xSNOB'>
      {!+(lockedAmount?.toString() || 0)
        ? (<CreateLock />)
        : isExpired
          ? (<Withdraw />)
          : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <IncreaseAmount />
              </Grid>
              <Grid item xs={12}>
                <IncreaseTime />
              </Grid>
            </Grid>
          )
      }
    </CardWrapper>
  )
}

export default memo(LockForm)