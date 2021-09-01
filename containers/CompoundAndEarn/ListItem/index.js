import { memo, useMemo, useState } from 'react';

import { useContracts } from 'contexts/contract-context';
import CustomAccordion from 'components/CustomAccordion';
import CompoundDialogs from 'parts/Compound/CompoundDialogs';
import CompoundListDetail from 'parts/Compound/CompoundListDetail';
import CompoundActionButton from 'parts/Compound/CompoundActionButton';
import DetailItem from 'parts/Compound/CompoundListItem/DetailItem';
import getUserBoost from 'utils/helpers/getUserBoost';
import getProperAction from 'utils/helpers/getProperAction';
import { isEmpty } from 'utils/helpers/utility';

const ListItem = ({
  pool
}) => {
  const { gauges, snowconeBalance, totalSnowcone } = useContracts();

  const [modal, setModal] = useState({ open: false, title: '' })
  const [actionType, action] = getProperAction(pool, setModal, pool.userLPBalance, pool.userDepositedLP);

  const selectedGauge = useMemo(() => gauges.find((gauge) =>
    {
      if(pool.gaugeInfo){
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
    if(pool.gaugeInfo){
      let total = (boost * pool.gaugeInfo.snobYearlyAPR) + pool.yearlyAPY;
      total = total > 999999 ? 999999 : total
      return total
    }else{
      return 0
    }
  }, [boost, pool])

  // Remove 1.5 after 1 week
  const userBoost = `${(boost ? boost * 1.5 : 1.5).toFixed(2)}x`;

  return (
    <>
      <CustomAccordion
        key={pool.address}
        expandMoreIcon={
          <CompoundActionButton
            type={actionType}
            action={action}
            disabled={actionType !== 'Details' && pool.deprecated}
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
            userBoost={userBoost}
            totalAPY={totalAPY}
          />
        }
      />
      {modal.open && (
        <CompoundDialogs
          open={modal.open}
          title={modal.title}
          item={pool}
          handleClose={() => setModal({ open: false, title: '' })}
        />
      )}
    </>
  );
};

export default memo(ListItem);