import { memo } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
  }
}));

const WithdrawTokenRadio = ({
  tokens,
  value,
  setValue
}) => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <RadioGroup row aria-label='position' value={value} onChange={(e) => setValue(parseInt(e.target.value, 10))}>
        {tokens.map((token) => (
          <FormControlLabel
            key={token.value}
            value={token.value}
            control={<Radio color='primary' />}
            label={token.label}
          />
        ))}
      </RadioGroup>
    </div>
  );
}

export default memo(WithdrawTokenRadio)