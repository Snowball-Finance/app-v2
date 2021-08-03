
import { memo, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import { useStakingContract } from 'contexts/staking-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

const Withdraw = () => {
  const classes = useStyles();
  const { withdraw } = useStakingContract();

  const withdrawHandler = useCallback(() => {
    withdraw()
  }, [withdraw]);

  return (
    <div className={classes.form}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ContainedButton
            fullWidth
            onClick={withdrawHandler}
          >
            Withdraw
          </ContainedButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default memo(Withdraw)