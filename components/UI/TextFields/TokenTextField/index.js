import React, { memo } from 'react';
import {
  OutlinedInput,
  Select,
  MenuItem,
  Button,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx'

import SnowTokenIcon from 'components/SnowTokenIcon'

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: theme.spacing(3, 2.5),
      borderRadius: 5,
      border: `1px solid ${theme.custom.palette.border}`,
    },
    errorInput: {
      border: `1px solid ${theme.palette.danger.main}`
    },
    control: {
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing(1)
    },
    tokenIcon: {
      marginRight: theme.spacing(1)
    },
    select: {
      fontSize: 26,
      fontWeight: 'bold',
      marginRight: theme.spacing(1),
      '&::before': {
        borderBottom: 0
      },
    },
    selectInput: {
      paddingTop: 0,
      paddingBottom: 0
    },
    maxButton: {
      fontSize: 12,
      fontWeight: 'bold',
      minWidth: 'unset',
      padding: theme.spacing(0, 1),
      backgroundColor: theme.custom.palette.lightBlue
    },
    textField: {
      border: 'none',
    },
    input: {
      fontSize: 26,
      fontWeight: 'bold',
      direction: 'rtl',
      padding: theme.spacing(0),
      color: theme.palette.text.primary,
    },
    notchedOutline: {
      border: 'none'
    },
    balance: {
      fontSize: 12
    }
  };
});

const TokenTextField = React.forwardRef(({
  label,
  isTokenSelect = false,
  token,
  setToken,
  tokens,
  balance = 0,
  error,
  onChange,
  ...rest
}, ref) => {
  const classes = useStyles();

  const maxHandler = () => {
    onChange(balance)
  }

  const selectHandler = (event) => {
    setToken(event.target.value)
  }

  return (
    <div className={clsx(classes.root, { [classes.errorInput]: !!error })}>
      <div className={classes.control}>
        <SnowTokenIcon token={token.priceId} className={classes.tokenIcon} />
        <div>
          <Typography variant='caption'>
            {label}
          </Typography>
          {isTokenSelect
            ? (
              <Select
                displayEmpty
                inputProps={{ 'aria-label': 'available tokens' }}
                value={token}
                onChange={selectHandler}
                className={classes.select}
                classes={{
                  select: classes.selectInput
                }}
              >
                {tokens.map((token, index) => {
                  return (
                    <MenuItem key={index} value={token}>
                      {token.name}
                    </MenuItem>
                  );
                })}
              </Select>
            ) : (
              <Typography className={classes.select}>
                {token.name}
              </Typography>
            )
          }
        </div>
        {!!balance &&
          <Button className={classes.maxButton} onClick={maxHandler} >
            MAX
          </Button>
        }
      </div>
      <div>
        <OutlinedInput
          inputRef={ref}
          variant='outlined'
          type='number'
          error={!!error}
          className={clsx(
            'form-control form-control-lg',
            classes.textField
          )}
          classes={{
            input: classes.input,
            notchedOutline: classes.notchedOutline
          }}
          onChange={onChange}
          {...rest}
        />
        <Typography align='right' className={classes.balance}>
          {`Balance: ${balance.toLocaleString()}`}
        </Typography>
        {!!error &&
          <Typography
            align='right'
            variant='subtitle2'
            color='error'
          >
            {error}
          </Typography>
        }
      </div>
    </div>
  );
})

export default memo(TokenTextField)