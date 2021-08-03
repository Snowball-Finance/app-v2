
import React, { memo } from 'react'
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { estimateXSnobForPeriod } from 'utils/helpers/stakeDate'

const useStyles = makeStyles((theme) => ({
  group: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  radio: {
    color: theme.palette.text.primary
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: theme.palette.text.primary
  }
}));

const DAY = 86400;
const WEEK = 7 * 86400;

const SnowRadio = React.forwardRef(({
  items,
  error,
  className,
  ...rest
}, ref) => {
  const classes = useStyles()

  const getXSnobByDuration = (value) => {
    switch (value) {
      case '1':
        return estimateXSnobForPeriod(1, WEEK).toFixed(4)
      case '2':
        return estimateXSnobForPeriod(1, DAY * 30).toFixed(4)
      case '3':
        return estimateXSnobForPeriod(1, DAY * 365).toFixed(4)
      case '4':
        return estimateXSnobForPeriod(1, DAY * 365 * 2).toFixed(4)
      default:
        return estimateXSnobForPeriod(1, WEEK).toFixed(4)
    }
  };

  return (
    <div className={className}>
      <RadioGroup
        ref={ref}
        aria-label='radio'
        className={classes.group}
        {...rest}
      >
        {items.map((item, index) => (
          <FormControlLabel
            key={index}
            value={item.VALUE}
            control={<Radio classes={{ root: classes.radio }} />}
            className={classes.label}
            label={
              <Typography className={classes.label}>
                {item.LABEL}
                <br />
                {`1 Snob = ${getXSnobByDuration(item.VALUE)} xSnob`}
              </Typography>
            }
          />
        ))}
      </RadioGroup>
      {!!error &&
        <Typography variant='subtitle2' color='error'>
          {error}
        </Typography>
      }
    </div>
  );
})

export default memo(SnowRadio)