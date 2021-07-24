import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CustomAccordion from 'components/CustomAccordion';
import DetailItem from 'parts/Compound/CompoundListItem/DetailItem';
import CompoundListDetail from 'parts/Compound/CompoundListDetail';
import { useContracts } from 'contexts/contract-context';
import getUserBoost from 'utils/helpers/getUserBoost';

const useStyles = makeStyles((theme) => ({
  detailButton: {
    textTransform: 'none',
    backgroundColor: theme.custom.palette.lightBlue,
    color: theme.custom.palette.blue,
  },
}));

const ListView = ({ poolsInfo }) => {
  const classes = useStyles();
  const detailButton = () => (
    <ContainedButton
      className={classes.detailButton}
      size="small"
      disableElevation
      endIcon={<ArrowDropDownCircleIcon />}
    >
      Details
    </ContainedButton>
  );
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

    return (
      <CustomAccordion
        key={item.address}
        expandMoreIcon={detailButton()}
        summary={<DetailItem item={item} userBoost={userBoost} totalAPY={totalAPY} />}
        details={<CompoundListDetail item={item} userBoost={userBoost} totalAPY={totalAPY} />}
      />
    );
  });
};

export default memo(ListView);