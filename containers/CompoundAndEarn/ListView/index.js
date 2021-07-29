import CustomAccordion from 'components/CustomAccordion';
import { useContracts } from 'contexts/contract-context';
import CompoundListDetail from 'parts/Compound/CompoundListDetail';
import CompoundActionButton from 'parts/Compound/CompoundActionButton';
import DetailItem from 'parts/Compound/CompoundListItem/DetailItem';
import { memo } from 'react';
import getUserBoost from 'utils/helpers/getUserBoost';
import getProperAction from 'utils/helpers/getProperAction';

const ListView = ({ poolsInfo }) => {
  const { gauges, snowconeBalance, totalSnowcone } = useContracts();

  return poolsInfo?.map((item) => {
    const _gauge = gauges.filter(function (gauge) {
      return gauge.address.toLowerCase() === item.gaugeInfo.address.toLowerCase();
    });
    let boost = 1.0;
    if (_gauge.length > 0) {

      const gauge = _gauge[0];
      if (gauge.staked > 0) {
        boost = getUserBoost(totalSnowcone / 1e18, gauge.totalSupply /
          1e18, gauge.staked / 1e18, snowconeBalance);
      }
    }
    const totalAPY = (boost*item.gaugeInfo.snobYearlyAPR)+item.yearlyAPY;

    const userBoost = `${(boost ? boost : 1.0).toFixed(1)}x`;

    const [ actionType, action ] = getProperAction(item, item.userLPBalance, item.userDepositedLP);
    
    return (
      <CustomAccordion
        key={item.address}
        expandMoreIcon={<CompoundActionButton type={actionType} action={action} />}
        summary={<DetailItem item={item} userBoost={userBoost} totalAPY={totalAPY} />}
        details={
          (actionType === "Details")
          ? <CompoundListDetail item={item} userBoost={userBoost} totalAPY={totalAPY} />
          : null
        }
      />
    );
  });
};

export default memo(ListView);