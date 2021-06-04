
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Slider } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },
  bar: {
    padding: theme.spacing(0, 2)
  }
}));

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  }
];

function valueText(value) {
  return `${value}%`;
}

const WithdrawPercentage = ({
  value,
  setValue
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography className={classes.label}>
        {`Withdraw percentage (%): ${value}`}
      </Typography>
      <div className={classes.bar}>
        <Slider
          getAriaValueText={valueText}
          aria-labelledby='discrete-slider-custom'
          valueLabelDisplay='auto'
          marks={marks}
          value={value}
          onChange={(e, value) => setValue(value)}
        />
      </div>
    </div>
  )
}

export default memo(WithdrawPercentage)