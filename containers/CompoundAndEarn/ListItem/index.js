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
  const [modal, setModal] = useState({ open: false, title: '' });

  const selectedGauge = useMemo(() => gauges.find((gauge) => gauge.address.toLowerCase() === pool.gaugeInfo.address.toLowerCase()), [gauges, pool])

  const handleClose = () => {
    setModal({ open: false, title: '' })
  }

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

  const totalAPY = (boost * pool.gaugeInfo.snobYearlyAPR) + pool.yearlyAPY;
  const userBoost = `${(boost ? boost : 1.0).toFixed(1)}x`;

  const [ actionType, action ] = getProperAction(pool, setModal, pool.userLPBalance, pool.userDepositedLP);
  return (
    <>
      <CustomAccordion
        key={pool.address}
        expandMoreIcon={<CompoundActionButton type={actionType} action={action} />}
        summary={<DetailItem item={pool} userBoost={userBoost} totalAPY={totalAPY} />}
        details={ <CompoundListDetail item={pool} userBoost={userBoost} totalAPY={totalAPY} /> }
      />
      {modal.open && (
        <CompoundDialogs
          open={modal.open}
          title={modal.title}
          item={pool}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default memo(ListItem);