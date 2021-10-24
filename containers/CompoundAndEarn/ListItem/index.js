import { memo, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

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
  poolList,
  modal,
  setModal
}) => {
  const classes = useStyles();
  const { gauges, snowconeBalance, totalSnowcone } = useContracts();
  const [timerRefresh, setTimerRefresh] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [userData, setUserData] = useState();
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState({ actionType: 'Get_Token' });
  const { account } = useWeb3React();
  const { loading, getBalanceInfoSinglePool, isTransacting
    , userPools } = useCompoundAndEarnContract();

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
  }, [refresh]);

  //refresh LP data if the accordion is expanded
  const onChangedExpanded = (event, expanded) => {
    setExpanded(expanded);
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
      if (expanded && !pool.deprecatedPool) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

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
    if (pool.token0) {
      const arrayAction = getProperAction(evalPool, setModal,
        evalPool.userLPBalance, evalPool.userDepositedLP);
      actionType = arrayAction[0];
      func = arrayAction[1];
    } else {
      actionType = "Details";
      func = () => { };
    }
    setAction({ actionType, func });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, pool]);

  const selectedGauge = useMemo(() => gauges.find((gauge) => {
    if (pool.gaugeInfo) {
      return gauge.address.toLowerCase() === pool.gaugeInfo.address.toLowerCase();
    }
  }), [gauges, pool])

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
      let total = (boost * pool.gaugeInfo.snobYearlyAPR) + pool.yearlyAPY;
      total = total > 999999 ? 999999 : total
      return total
    } else {
      return 0
    }
  }, [boost, pool])

  const userBoost = `${(boost ? boost * 1.0 : 1.0).toFixed(2)}x`;

  return (
    <>
      <CustomAccordion
        key={pool.address}
        className={clsx({ [classes.accordionContainer]: action?.actionType === 'Details' })}
        onChanged={onChangedExpanded}
        expandMoreIcon={
          <CompoundActionButton
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
            modal={modal}
            setModal={setModal}
            setUserData={setUserData}
            userBoost={userBoost}
            totalAPY={totalAPY}
          />
        }
      />
      {modal.open && pool.address === modal.address && (
        <CompoundDialogs
          title={modal.title}
          open={modal.open}
          pool={pool}
          poolList={poolList}
          item={userData}
          handleClose={() => setModal({ open: false, title: '' })}
        />
      )}
    </>
  );
};

export default memo(ListItem);