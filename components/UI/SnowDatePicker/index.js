
import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import {
  DatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers'
import clsx from 'clsx'
import DateFnsUtils from '@date-io/date-fns'
import 'date-fns'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  textField: {
    width: '100%',
    border: `1px solid ${theme.custom.palette.border}`,
    borderRadius: 5,
  },
  input: {
    fontSize: 16,
    fontFamily: 'roboto, sans-serif',
    lineHeight: 'normal',
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    '&::placeholder': {
      lineHeight: 'normal',
      color: theme.palette.text.primary,
    },
    '&:-ms-input-placeholder': {
      lineHeight: 'normal',
      color: theme.palette.text.primary,
    },
    '&::-ms-input-placeholder': {
      lineHeight: 'normal',
      color: theme.palette.text.primary,
    },
    '&::-webkit-calendar-picker-indicator:focus': {
      display: 'none'
    }
  },
  notchedOutline: {
    border: 'none'
  },
  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  max: {
    cursor: 'pointer'
  },
  error: {
    border: `1px solid ${theme.palette.danger.main}`
  }
}));

const SnowDatePicker = React.forwardRef(({
  label,
  error,
  onMax,
  className,
  ...rest
}, ref) => {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)}>
      {!!label &&
        <div className={classes.labelContainer}>
          <Typography color='textSecondary'>
            {label}
          </Typography>
          {onMax &&
            <Typography
              color='textPrimary'
              className={classes.max}
              onClick={onMax}
            >
              Max
            </Typography>
          }
        </div>
      }

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          {...rest}
          inputRef={ref}
          helperText={null}
          error={false}
          variant='inline'
          inputVariant='outlined'
          format='MM/dd/yyyy'
          className={clsx('form-control form-control-lg', classes.textField)}
          InputProps={{
            classes: {
              input: classes.input,
              error: classes.error,
              notchedOutline: classes.notchedOutline,
            }
          }}
        />
      </MuiPickersUtilsProvider>
      {!!error &&
        <Typography variant='subtitle2' color='error'>
          {error}
        </Typography>
      }
    </div>
  );
});

export default memo(SnowDatePicker);
