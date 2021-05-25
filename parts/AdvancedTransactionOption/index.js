
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import SnowTextField from 'components/UI/TextFields/SnowTextField'
import ContainedButton from 'components/UI/Buttons/ContainedButton';

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
    margin: theme.spacing(0, 1)
  },
  firstInput: {
    maxWidth: 80
  },
  secondInput: {
    maxWidth: 120
  }
}));

const AdvancedTransactionOption = () => {
  const classes = useStyles();

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
          <SnowTextField
            type='number'
            name='percent'
            endAdornment={'%'}
            className={classes.firstInput}
          />
          <ContainedButton className={classes.button}>
            1%
          </ContainedButton>
          <SnowTextField
            type='number'
            name='percent'
            endAdornment={'%'}
            className={classes.secondInput}
          />
        </div>
      </div>
    </>
  )
}

export default memo(AdvancedTransactionOption)