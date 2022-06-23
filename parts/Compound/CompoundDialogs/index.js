import { memo, useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Box, Grid } from '@material-ui/core';

import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import Toast from 'components/Toast';
import SnowStepBox from 'components/SnowStepBox';
import SnowDialog from 'components/SnowDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CompoundSlider from './CompoundSlider';
import CompoundInfo from './CompoundInfo';
import Details from './Details';
import { compoundDialogReducer, compoundDialogActionTypes } from './reducer'
import { storage, StorageKeys } from 'utils/storage';
import { useContracts } from 'contexts/contract-context';
import { AnalyticActions, AnalyticCategories, createEvent, analytics } from "utils/analytics";
import AdvancedTransactionOption from 'parts/AdvancedTransactionOption';
import { usePrices } from 'contexts/price-context';

const useStyles = makeStyles(theme => ({
  dialog: {
    minWidth: 200,
    width: 510,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  dialogTitle: {
    background: 'none',
    justifyContent: 'left',
    height: 48,
    paddingBottom: 0,
  },
  dialogTitleText: {
    color: 'currentColor',
    textTransform: 'none',
  },
  dialogCloseIcon: {
    color: 'currentColor',
    top: theme.spacing(0.5),
    right: theme.spacing(1.5),
  },
  container: {
    padding: theme.spacing(1),
  },
  linedContainer: {
    padding: theme.spacing(1, 1.5),
    marginTop: theme.spacing(1),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
    backgroundColor: theme.custom.palette.joe_red
  },
  warningBox: {

  },
  buttonContainer: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  modalButton: {
    padding: theme.spacing(2, 0),
    textTransform: 'none',
    '&:disabled': {
      backgroundColor: `${theme.custom.palette.blueButton} !important`,
    }
  },
  button: {
    textTransform: 'none',
    width: '100%',
    padding: theme.spacing(2, 0),
  },
  greyButton: {
    background: '#BDBDBD',
  },
  center: {
    textAlign: 'center'
  },
  cautionBox: {
    marginBottom: theme.spacing(1)
  }
}));

const CompoundDialogs = ({
  open,
  title,
  pool,
  userData,
  handleClose,
  renderCaution
}) => {
  if (!userData) {
    return null;
  }
  const { prices } = usePrices()

  const classes = useStyles();
  // i will need the pool to extract the token infos
  const [state, dispatch] = useReducer(compoundDialogReducer, {
    title,
    userData,
    userAVAXBalance: 0,
    sliderValue: 0,
    amount: 0,
    pool,
    inputAmount: 0,
    mixedTokenValue: 0,
    calculatedInvestingTokensAmount: [],
    tokens: [],
    tokensSwapOut: [],
    selectedToken: userData?.token0,
    approved: false,
    isInfiniteApproval: storage.read(StorageKeys.infiniteApproval, false),
    slippage: storage.read(StorageKeys.slippage, "1"),
    showAdvanced: storage.read(StorageKeys.showAdvanced, false),
    error: null
  })

  const { approve, deposit, isTransacting, transactionStatus, calculateSwapAmountOut,
  setTransactionStatus } = useCompoundAndEarnContract();
  const { AVAXBalance } = useContracts();

  useEffect(() => {
    if (!isTransacting.deposit && !isTransacting.approve) {
      toast.dismiss();
    }
  }), [isTransacting];

  useEffect(() => {
    if (transactionStatus.depositStep === 2) {
      handleClose();
    }
  }), [transactionStatus];

  const enabledHandler = (isApproved = false) => {
    return (isApproved ? state.approved : !state.approved) || (state.amount == 0) ||
      isTransacting.approve || isTransacting.deposit;
  }

  const handleInputChange = (event) => {
    const value = event.target.value
    dispatch({
      type: compoundDialogActionTypes.setInputValue,
      payload: value
    })
  };

  const handleSliderChange = (value) => {
    dispatch({
      type: compoundDialogActionTypes.setSliderValue,
      payload: value,
    })
  };

  const handleApproveClick = async () => {
    try {
      toast(<Toast message={'Checking for approval...'} toastType={'processing'} />)
      const addressToZap = state.selectedToken.isLpToken || state.hasAVAX || state.tokens.length < 2
        ? null
        : state.selectedToken.address;
      const result = await approve(
        userData,
        state.amount,
        addressToZap,
        state.selectedToken.isNativeAVAX,
        storage.read(StorageKeys.infiniteApproval)
      )
      if (result) {
        dispatch({ type: compoundDialogActionTypes.setApproved, payload: true })
      }
    } catch (error) {
      console.log(error);
      analytics.trackEvent(createEvent({
        category: AnalyticCategories.error,
        action: AnalyticActions.wallet,
        name: `submit ${amount}`,
      }))
    }
  };

  const handleInfiniteApproval = (v) => {
    dispatch({ type: compoundDialogActionTypes.setInfiniteApprovalCheckboxValue, payload: v })
  }

  const handleShowAdvanced = (v) => {
    dispatch({ type: compoundDialogActionTypes.setShowAdvanced, payload: v })
    dispatch({ type: compoundDialogActionTypes.setSlippage, payload: state.slippage })
  }

  const handleSlippage = (v) => {
    if (!v) {
      v = 1;
    } else if (!Number(v)) {
      return;
    } else if (v > 50) {
      v = 50;
    }

    dispatch({ type: compoundDialogActionTypes.setSlippage, payload: Math.floor(v) })
  }

  const handleTokenChange = (token) => {
    setTransactionStatus({ approvalStep: 0, depositStep: 0 })
    dispatch({
      type: compoundDialogActionTypes.reset, payload: {
        sliderValue: 0,
        amount: 0,
        inputAmount: 0,
        mixedTokenValue: 0,
        calculatedInvestingTokensAmount: [],
        selectedToken: token,
        approved: false,
        error: null,
        priceImpact: 0,
        tokensSwapOut: []
      }
    })
  }
  useEffect(() => {
    dispatch({ type: compoundDialogActionTypes.setUserData, payload: { ...userData, userAVAXBalance: AVAXBalance, prices } })
    return () => {

    }
  }, [userData, userData?.token0Balance, AVAXBalance])

  useEffect(() => {
    const idx = state.tokens.findIndex(o => o.isLpToken)
    if (idx > -1) {
      //defaults lp token
      dispatch({
        type: compoundDialogActionTypes.reset, payload: {
          sliderValue: 0,
          amount: 0,
          inputAmount: 0,
          mixedTokenValue: 0,
          calculatedInvestingTokensAmount: [],
          selectedToken: state.tokens[idx],
          approved: false,
          error: null,
          priceImpact: 0,
          tokensSwapOut: []
        }
      })
    }
  }, [state.tokens])

  useEffect(() => {
    if (state.tokens.length > 1 && !state.hasAVAX && !state.selectedToken.isLpToken) {
      calculateSwapAmountOut(
        state.selectedToken.isNativeAVAX, state.amount, state.userData, state.selectedToken
      ).then((result) => {
        dispatch({
          type: compoundDialogActionTypes.setPriceImpact, payload: {
            swap: result,
            amount: state.amount
          }
        })
      })
    }
  }, [state.amount, calculateSwapAmountOut])

  const renderButton = () => {
    const addressToZap = state.selectedToken.isLpToken || state.hasAVAX || state.tokens.length < 2
      ? null
      : state.selectedToken.address;

    return (
    state.priceImpact < 5 && state.amount > 0 ? 
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <ContainedButton
            className={classes.modalButton}
            disableElevation
            fullWidth
            disabled={enabledHandler(true)}
            loading={isTransacting.approve}
            onClick={() => {
              handleApproveClick()
            }}
          >
            Approve
          </ContainedButton>
        </Grid>
        <Grid item xs={6}>
          <ContainedButton
            className={classes.modalButton}
            disableElevation
            fullWidth
            disabled={enabledHandler(false)}
            loading={isTransacting.deposit}
            onClick={() => {
              deposit(
                userData, //general user data
                state.amount, //amount to deposit
                addressToZap,
                false, //onlygauge
                state.selectedToken.address === "0x0", //is native avax
                state.slippage, //zappers slippage
              )
            }
            }
          >
            Deposit
          </ContainedButton>
        </Grid>
      </Grid> : null) 
  }

return (
  <SnowDialog
    open={open}
    title={title}
    onClose={() => handleClose()}

    dialogClass={classes.dialog}
    dialogTitleClass={classes.dialogTitle}
    titleTextClass={classes.dialogTitleText}
    closeIconClass={classes.dialogCloseIcon}
  >
      <>	
        <Grid container className={classes.cautionBox}>
          {renderCaution(pool)}
        </Grid>

        <Typography variant='subtitle2'>Select token to convert</Typography>
        <div className={classes.container} >

          <Details
            {...{
              userData,
            }}
            vaultToken={state.userData.vaultToken}
            selectedToken={state.selectedToken}
            tokens={state.tokens}
            amount={state.inputAmount}
            onTokenChange={handleTokenChange}
            inputHandler={handleInputChange}
            error={state.error}
          />

          <CompoundSlider value={state.sliderValue} onChange={handleSliderChange} />
          {!userData.metaToken && !state.hasAVAX && state.tokens.length > 1 && < CompoundInfo
            pool={pool}
            userData={state.userData}
            tokens={state.tokens} //we still need to filter the lptoken out
            selectedTokenWithAmount={{ ...state.selectedToken, amount: state.inputAmount }}
            activeToken={state.selectedToken}
            swapAmountOut={state.tokensSwapOut} />}
          <AdvancedTransactionOption
            handleInfiniteApproval={handleInfiniteApproval}
            handleSlippage={handleSlippage}
            handleShow={handleShowAdvanced}
            state={state}
          />
          {state.priceImpact > 1 && state.amount > 0 &&
          <Grid className={classes.linedContainer} marginTop={2}>
            <Box justifyContent="center" display="flex" className={classes.warningBox} > 
              WARNING!! Price Impact too High!! {`${state.priceImpact.toFixed(2)}%`} 
            </Box>
          </Grid>} 
          <div className={classes.buttonContainer}>
            {renderButton()}
          </div>
        </div>
        <div className={classes.mt1}>
          <SnowStepBox
            transactionStatus={transactionStatus}
            title={title}
            singleApprove={state.selectedToken.isNativeAVAX && state.tokens.length > 2}
            singleDeposit={!state.selectedToken.isLpToken && state.tokens.length > 2}
          />
        </div>
      </>
  </SnowDialog>
);
};

export default memo(CompoundDialogs);
