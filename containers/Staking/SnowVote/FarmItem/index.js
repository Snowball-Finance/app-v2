import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

import SnowTextField from 'components/UI/TextFields/SnowTextField'
import FarmIcon from './FarmIcon'
import { formatPercent, formatAPY } from 'utils/helpers/format'

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      alignItems: 'flex-start',
    },
  },
}));

const FarmItem = ({
  item,
  newWeights,
  value = 0,
  onChange
}) => {
  const classes = useStyles();

  const pickleAPYMin = useMemo(() => item.fullApy * 100 * 0.4, [item.fullApy]);
  const pickleAPYMax = useMemo(() => item.fullApy * 100, [item.fullApy]);

  const newWeight = useMemo(() => {
    const newWeightMaybe = newWeights?.find((x) => x[item.address] >= 0);
    return newWeightMaybe ? newWeightMaybe[item.address] : null
  }, [item, newWeights])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4} className={classes.imageContainer}>
        <FarmIcon token={item.token} />
        <div>
          <Typography color='textPrimary' variant='body1'>{item.poolName}</Typography>
          <Typography color='textPrimary' variant='body1'>{item.depositTokenName}</Typography>
        </div>
      </Grid>
      <Grid item xs={12} sm={6} md={3} className={classes.labelContainer}>
        <Typography color='textPrimary' variant='body1'>
          {`${formatAPY(pickleAPYMin)} ~ ${formatAPY(pickleAPYMax)}`}
        </Typography>
        <Typography color='textPrimary' variant='body1'>
          Snob APY
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={3} className={classes.labelContainer}>
        <Typography color='textPrimary' variant='body1'>
          {`${formatPercent(item.allocPoint)}% -> ${newWeight ? formatPercent(newWeight) : 0}%`}
        </Typography>
        <Typography color='textPrimary' variant='body1'>
          Current reward weight
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={2} className={classes.labelContainer}>
        <SnowTextField
          type='number'
          name='percent'
          inputProps={{
            min: 0,
            max: 100
          }}
          endAdornment={'%'}
          value={value}
          error={value > 100 ? 'This value should be less than 100%' : ''}
          onChange={(e) => onChange(e.target.value)}
        />
      </Grid>
    </Grid>
  )
}

export default memo(FarmItem)
