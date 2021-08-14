import { memo } from 'react'
import { Grid, Typography } from '@material-ui/core'


const CalculatorPreview = ({
  boostFactor,
  xSnobRequired
}) => {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography color='textPrimary' variant='body1'>
          {`Snowball boost factor: ${boostFactor?.toFixed(3)}x`}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography color='textPrimary' variant='body1'>
          {`xSNOB required for max boost: ${xSnobRequired?.toFixed(3) || null}`}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default memo(CalculatorPreview)
