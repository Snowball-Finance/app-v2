
import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Divider, Typography } from '@material-ui/core'

import SnowTextField from 'components/UI/TextFields/SnowTextField'
import { SnowCheckbox } from 'components/UI/Checkbox';

const useStyles = makeStyles((theme) => ({
  header: {
    fontWeight: 'bold',
    borderRadius: 4,
    padding: theme.spacing(0.5, 1),
    backgroundColor: theme.custom.palette.lightBlue
  },
  upsideDown: {
    animation: "spin 0.5s linear",
    transform: "rotateZ(0deg)"
  },
  divider: {
    height: '1px',
  },
  mt1: {
    marginLeft: '1px',
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
  state,
  handleSlippage,
  handleInfiniteApproval,
  handleShow,
  useApproval = true,
}) => {
  const classes = useStyles();

  const inputHandler = (event) => {
    handleSlippage(event.target.value)
  }

  const handleClickShow = () => {
    handleShow(!state.showAdvanced)
  }

  return (
    <>
      <div className={classes.container}>
        {useApproval && <span
          onClick={handleClickShow}
        >
          <svg
            className={state.showAdvanced ? classes.upsideDown : null}
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            transform="rotate(-90,0,0)"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.8252 0C16.077 0 16.3783 0.827943 15.487 1.86207L8.80565 9.61494C8.35999 10.1321 7.63098 10.1246 7.19174 9.61494L0.510262 1.86207C-0.376016 0.833678 -0.0777447 0 1.17205 0L14.8252 0Z"
              fill="#3290FE" />
          </svg>
          <style>{`
            @keyframes spin {
                 0% { transform: rotate(-90deg); }
                 100% { transform: rotate(0deg); }
            }
        `}</style>
          Advanced Options
          <Divider
            flexItem
            orientation="horizontal"
            className={classes.divider}
          />
        </span>}

        {(state.showAdvanced || !useApproval) && <> <Typography className={classes.label}>
          Max Slippage:
        </Typography>
          <div className={classes.inputContainer}>
            <SnowTextField
              type='number'
              name='percent'
              endAdornment={'%'}
              className={classes.input}
              value={state.slippage}
              inputProps={{ max: 50 }}
              onChange={inputHandler}
              onKeyDown={e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()} />
            {useApproval && <SnowCheckbox
              className={classes.mt1}
              label="Infinite Approval"
              isChecked={state.isInfiniteApproval}
              onChange={handleInfiniteApproval} />}
          </div>
        </>
        }
      </div>
    </>
  )
}

export default memo(AdvancedTransactionOption)