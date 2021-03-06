import { memo, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

import { useContracts } from 'contexts/contract-context';
import CustomAccordion from 'components/CustomAccordion';
import CompoundDialogs from 'parts/Compound/CompoundDialogs';
import CompoundListDetail from 'parts/Compound/CompoundListDetail';
import CompoundActionButton from 'parts/Compound/CompoundActionButton';
import DetailItem from 'parts/Compound/CompoundListItem/DetailItem';
import getUserBoost from 'utils/helpers/getUserBoost';
import getProperAction from 'utils/helpers/getProperAction';
import { isEmpty } from 'utils/helpers/utility';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { useWeb3React } from '@web3-react/core';
import Caution from 'components/Caution';
import { formatNumber } from 'utils/helpers/format';

import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  accordionContainer: {
    '& .MuiAccordion-root': {
      filter: 'drop-shadow(0px 4px 10px rgba(51, 169, 255, 0.5))'
    }
  },
}));

const ListItem = ({
  pool,
  modal,
  setModal
}) => {
  const classes = useStyles();
  const { gauges, snowconeBalance, totalSnowcone, AVAXBalance } = useContracts();
  const [timerRefresh, setTimerRefresh] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [userData, setUserData] = useState();
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState({ actionType: 'Get_Token' });
  const { account } = useWeb3React();
  const { loading, getBalanceInfoSinglePool, isTransacting
    , userPools, userLastDeposits } = useCompoundAndEarnContract();

  useEffect(() => {
    const refreshData = async () => {
      if (refresh) {
        if (!loading && !modal.open && account && !isTransacting.pageview) {
          const balanceInfo = await getBalanceInfoSinglePool(pool.address);
          setUserData(balanceInfo);
        }
        setRefresh(false);
      }
    }
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, account]);

  //refresh LP data if the accordion is expanded
  const onChangedExpanded = (event, expanded) => {
    const targetName = event.target.getAttribute('name');
    if (targetName !== 'custom-popover') {
      setExpanded(expanded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  useEffect(() => {
    if (modal.open || isTransacting.pageview) {
      setRefresh(false);
      setTimerRefresh(clearInterval(timerRefresh));
    } else if (expanded && !pool.deprecatedPool) {
      setTimerRefresh(setInterval(() => {
        setRefresh(true);
      }, 30000));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, isTransacting]);

  useEffect(() => {
    const addTimer = async () => {
      if ((account || expanded) && !pool.deprecatedPool) {
        //reset state
        if (timerRefresh) {
          setRefresh(false);
          setTimerRefresh(clearInterval(timerRefresh));
        }
        if (!modal.open && account && !isTransacting.pageview) {
          const balanceInfo = await getBalanceInfoSinglePool(pool.address);
          setUserData(balanceInfo);
        }
        setTimerRefresh(setInterval(() => {
          setRefresh(true);
        }, 30000));
      } else {
        if (timerRefresh) {
          setTimerRefresh(clearInterval(timerRefresh));
        }
      }
    }
    addTimer();
    return () => setTimerRefresh(clearInterval(timerRefresh))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, account]);

  useEffect(() => {
    const userPool = userPools.find(
      (p) => p?.address.toLowerCase() === pool.address.toLowerCase());
    if (userPool) {
      setUserData(userPool);
    } else {
      setUserData(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, userPools]);

  useEffect(() => {
    const evalPool = userData ? userData : pool;
    let actionType, func;
    if (pool.token0 && AVAXBalance !== 0) {
      const arrayAction = getProperAction(evalPool, setModal,
        evalPool.userLPBalance, AVAXBalance, evalPool.userDepositedLP);
      actionType = arrayAction[0];
      func = arrayAction[1];
    } else {
      actionType = "Details";
      func = () => { };
    }
    setAction({ actionType, func });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, pool, account, AVAXBalance]);

  const selectedGauge = useMemo(() => gauges.find((gauge) => {
    if (pool.gaugeInfo) {
      return gauge.address.toLowerCase() === pool.gaugeInfo.address.toLowerCase();
    }
  }), [gauges, pool]);

  const selectedUserDeposit = useMemo(() => {
    if(userLastDeposits.ListLastDepositsPerWallet){
      return userLastDeposits.ListLastDepositsPerWallet.find((depositInfo) => {
        return depositInfo.snowglobeAddress.toLowerCase() === pool.address.toLowerCase();
    })

  }},[pool,userLastDeposits, userLastDeposits.loading]);

  const boost = useMemo(() => {
    if (isEmpty(selectedGauge) || (selectedGauge?.staked || 0) <= 0) {
      return 1.0
    }

    const boost = getUserBoost(
      totalSnowcone / 1e18,
      selectedGauge.totalSupply / 1e18,
      selectedGauge.staked / 1e18,
      snowconeBalance
    );
    return boost;
  }, [selectedGauge, snowconeBalance, totalSnowcone]);

  const totalAPY = useMemo(() => {
    if (pool.gaugeInfo) {
      let total = (boost * pool.gaugeInfo.snobYearlyAPR) + pool.yearlyAPY + pool.yearlySwapFees;
      total = total > 999999 ? 999999 : total
      return total
    } else {
      return 0
    }
  }, [boost, pool])

  const userBoost = `${(boost ? boost * 1.0 : 1.0).toFixed(2)}x`;
  const highlighted = action?.actionType === 'Details' && (AVAXBalance !== 0 || (userData?.userDepositedLP || 0) > 0)

  const renderCaution = (pool) => {
    if (pool?.harvestInfo?.errored) {
      return (
        <Grid item xs={12}>
          <Caution>
            <Typography variant="caption">
              This pool is not currently being auto-compounded. We are aware of the issue
              and are working on it.
            </Typography>
          </Caution>
        </Grid>
      );
    } else if (pool?.deprecated) {
      return(
        <Grid item xs={12}>
          <Caution>
            <Typography variant="caption">
              This pool is not currently being auto-compounded. The platform no longer offer rewards.
            </Typography>
          </Caution>
        </Grid>
      )
    } else if (pool.harvestInfo && !(pool?.harvestInfo?.fulfillThreshold)) {
      return (
        <Grid item xs={12}>
          <Caution>
            <Typography variant="caption">
              This pool has too little TVL to be auto-compounded every day. TVL
              Threshold for daily auto-compound: ${formatNumber(pool.harvestInfo.minValueNeeded, 2)}
            </Typography>
          </Caution>
        </Grid>
      );
    }

    return null;
  };

  return (
    <>
      <CustomAccordion
        key={pool.address}
        className={clsx({ [classes.accordionContainer]: highlighted })}
        expanded={expanded}
        onChanged={onChangedExpanded}
        expandMoreIcon={
          AVAXBalance && <CompoundActionButton
            type={action?.actionType}
            action={action?.func}
            disabled={action?.actionType !== 'Details' && pool.deprecated}
            setUserData={setUserData}
            item={pool}
          />
        }
        summary={
          <DetailItem
            item={pool}
            userBoost={userBoost}
            totalAPY={totalAPY}
          />
        }
        details={
          <CompoundListDetail
            item={pool}
            userData={userData}
            setModal={setModal}
            setUserData={setUserData}
            userBoost={userBoost}
            totalAPY={totalAPY}
            boost={boost}
            userLastDeposit={selectedUserDeposit}
            renderCaution={renderCaution}
          />
        }
      />
      {modal.open && pool.address === modal.address && (
        <CompoundDialogs
          title={modal.title}
          open={modal.open}
          pool={pool}
          userData={userData}
          handleClose={() => setModal({ open: false, title: '' })}
          renderCaution={renderCaution}
        />
      )}
    </>
  );
};

export default memo(ListItem);