import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SnowTokenIcon from 'components/SnowTokenIcon';
import CustomPopover from 'components/CustomPopover';
import Tags from 'components/Tags';
import SnowPairsIcon from 'components/SnowPairsIcon';

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
  },
}));

const DetailItem = ({ item }) => {
  const classes = useStyles();
  const pairsIcon = item?.name.split('/');

  return (
    <div className={classes.card}>
      <div>
        <SnowPairsIcon pairsIcon={pairsIcon} />
      </div>

      <div>
        <Typography variant="subtitle2">{item?.name}</Typography>
        <Tags type="secondary">
          <SnowTokenIcon size={12} token="png" />
          Pangolin LP
        </Tags>
      </div>

      <div>
        <Typography variant="body2">
          APY <CustomPopover />
        </Typography>
        <Typography variant="subtitle1">{item.yearlyAPY?.toFixed(2)}%</Typography>
      </div>

      <div>
        <Typography variant="body2">
          TVL <CustomPopover />
        </Typography>
        <Typography variant="subtitle1">${item.tvlStaked}</Typography>
      </div>

      <div>
        <Typography variant="body2">
          Boost <CustomPopover />
        </Typography>
        <Tags type="primary">2.5x</Tags>
      </div>
    </div>
  );
};

export default memo(DetailItem);
