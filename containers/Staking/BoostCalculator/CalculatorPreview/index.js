import { memo, useMemo } from 'react'
import { Grid, Typography } from '@material-ui/core'

import { formatAPY } from 'utils/helpers/format'

const CalculatorPreview = ({
  selectedGauge,
  boostFactor,
  xSnobRequired
}) => {

  const snowBallAPY = useMemo(() => selectedGauge && boostFactor
    ? formatAPY(selectedGauge.fullApy / 2.5 * boostFactor * 100)
    : '0.0%'
    , [boostFactor, selectedGauge])

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
      <Grid item xs={12}>
        <Typography color='textPrimary' variant='body1'>
          {`Snowball APY: ${snowBallAPY}`}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default memo(CalculatorPreview)
