
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Typography } from '@material-ui/core'

import SnowTextField from 'components/UI/TextFields/SnowTextField'

const useStyles = makeStyles((theme) => ({
  header: {
    fontWeight: 'bold',
    borderRadius: 4,
    padding: theme.spacing(0.5, 1),
    backgroundColor: theme.custom.palette.lightBlue
  },
  container: {
    padding: theme.spacing(1, 1.5),
    marginTop: theme.spacing(1),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
  },
  label: {
    fontSize: 12,
    marginBottom: theme.spacing(1)
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  button: {
    marginRight: theme.spacing(1)
  },
  input: {
    maxWidth: 120
  }
}));

const AdvancedTransactionOption = ({
  value,
  setValue
}) => {
  const classes = useStyles();

  const inputHandler = (event) => {
    setValue(event.target.value)
  }

  return (
    <>
      <Typography
        variant='caption'
        color='primary'
        className={classes.header}
      >
        Advanced transaction options
      </Typography>
      <div className={classes.container}>
        <Typography className={classes.label}>
          Max Slippage:
        </Typography>
        <div className={classes.inputContainer}>
          <Button
            className={classes.button}
            variant={value === 0.1 ? 'contained' : 'outlined'}
            color='primary'
            onClick={() => setValue(0.1)}
          >
            0.1%
          </Button>
          <Button
            className={classes.button}
            variant={value === 1 ? 'contained' : 'outlined'}
            color='primary'
            onClick={() => setValue(1)}
          >
            1%
          </Button>
          <SnowTextField
            type='number'
            name='percent'
            endAdornment={'%'}
            className={classes.input}
            value={value}
            onChange={inputHandler}
            inputProps={{ min: 0, max: 50 }}
            onKeyDown={e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
          />
        </div>
      </div>
    </>
  )
}

export default memo(AdvancedTransactionOption)