import { memo, useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, useMediaQuery } from '@material-ui/core';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import ApyCalculation from './ApyCalculation';
import SnobAbyCalculation from './SnobAbyCalculation';
import Total from './Total';
import CompoundDialogs from '../CompoundDialogs';
import getProperAction from 'utils/helpers/getProperAction';
import CompoundActionButton from '../CompoundActionButton';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { toast } from 'react-toastify';
import Toast from 'components/Toast';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
    borderTop: '1px solid rgba(110, 107, 123, 0.24)',
    paddingTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dialogTitle: {
    background: 'none',
    justifyContent: 'left',
  },
  dialogTitleText: {
    color: 'currentColor',
    textTransform: 'none',
  },
  dialogCloseIcon: {
    color: 'currentColor',
  },
}));

const CompoundListDetail = ({ item, userBoost, totalAPY , modal, setModal,
  userData, setUserData }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const [action,setAction] = useState({actionType:'Get_Token'});

  const { withdraw, claim, isTransacting, getBalanceInfoSinglePool } = useCompoundAndEarnContract();

  useEffect(()=>{
    const evalPool = userData ? userData : item;
    if(item.token0){
      let actionType, func;
      [actionType, func] = getProperAction(evalPool, setModal, evalPool.userLPBalance, 0, true);
      setAction({actionType,func});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userData,item]);

  const handleClose = () => {
    setModal({ open: false, title: '' });
  };
  let dailyAPR = item.dailyAPR > 999999?999999:item.dailyAPR;
  let yearlyAPY = item.yearlyAPY > 999999?999999:item.yearlyAPY;

  const [withdraw_modal, setWithdraw] = useState(false);
  const handleWithdraw = () => {
    setWithdraw(false);
  }

  // const { setTransactionStatus } = useCompoundAndEarnContract();

  return (
    <div className={classes.root}>
      <Grid
        className={classes.details}
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        spacing={2}
      >
       {!item.deprecatedPool && <Grid item xs={12} lg={4}>
          <ApyCalculation
            kind={item.kind}
            dailyAPR={dailyAPR}
            yearlyAPY={yearlyAPY}
          />
        </Grid>}
        {!item.deprecatedPool &&<Grid item xs={12} lg={4}>
          <SnobAbyCalculation
            kind={item.kind}
            snobAPR={item.gaugeInfo?.snobYearlyAPR}
            totalAPY={totalAPY}
            userBoost={userBoost}
          />
        </Grid>}
        <Grid item xs={12} lg={4}>
          <Total item={item} userData={userData} />
        </Grid>
      </Grid>
      <Grid
        className={classes.button}
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
        spacing={2}
      >
        {!item.deprecatedPool && action?.actionType &&
        <Grid item xs={12} lg={4}>
          <CompoundActionButton
            type={action.actionType}
            action={action.func}
            endIcon={false}
            disabled={item.deprecated}
            fullWidth={isSm ? true : false}
          />
        </Grid>}
        <Grid item xs={12} lg={4}>
          <ContainedButton
            disabled={userData?.userDepositedLP === 0 || userData?.withdrew || !userData}
            loading={isTransacting.pageview}
            onClick={() => {
              //if(item.deprecatedPool){
              withdraw(item);
              //}else{
              // setTransactionStatus({ withdrawStep: 0 });
              //  setWithdraw(true)
              //}
            }}
            fullWidth={isSm ? true : false}
          >
            Withdraw
          </ContainedButton>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ContainedButton
            disabled={userData?.SNOBHarvestable === 0 || userData?.claimed || !userData}
            loading={isTransacting.pageview}
            onClick={() => {
              toast(<Toast message={'Claiming your Tokens...'} toastType={'processing'}/>)
              claim(item).then(()=>{
                if(!item.deprecatedPool){
                  getBalanceInfoSinglePool(item.address).then((userData) =>
                  setUserData(userData))
                }
              })
            }}
            fullWidth={isSm ? true : false}
          >
            Claim
          </ContainedButton>
        </Grid>
      </Grid>

      {modal.open && item.address === modal.address && (
        <CompoundDialogs
          open={modal.open}
          title={modal.title}
          item={userData}
          handleClose={handleClose}
        />
      )}

      {withdraw && (
        <CompoundDialogs
          open={withdraw_modal}
          title="Withdraw"
          handleClose={handleWithdraw}
          item={userData}
        />
      )}
    </div>
  );
};

export default memo(CompoundListDetail);
