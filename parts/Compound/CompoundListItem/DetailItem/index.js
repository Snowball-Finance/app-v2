import { memo } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SnowTokenIcon from 'components/SnowTokenIcon';
import CustomPopover from 'components/CustomPopover';
import Tags from 'components/Tags';
import SnowPairsIcon from 'components/SnowPairsIcon';
import Info from '../Info';
import TVLTooltip from '../TVLTooltip';
import APYTooltip from '../APYTooltip';
import { BOOST_INFO_IMAGE_PATH, SNOB_LOCK_IMAGE_PATH } from 'utils/constants/image-paths';
import getShortName from 'utils/helpers/getShortName';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '92%',
  },
  popover: {
    backgroundColor: theme.custom.palette.lightBlue,
    '&::before': {
      backgroundColor: theme.custom.palette.lightBlue,
    },
  },
}));

const DetailItem = ({ item, userBoost }) => {
  const classes = useStyles();
  const token0 = item.token0.address;
  const token1 = item.token1.address;
  const token2 = item.token2.address;
  const shortName = getShortName(item.source);

  return (
    <div className={classes.card}>
      <div>
        <SnowPairsIcon pairsIcon={[token0, token1, token2]} size={50} />
      </div>

      <div>
        <Typography variant="subtitle2">{item.name}</Typography>
        <Tags type={shortName}>
          <SnowTokenIcon size={12} token={shortName} />
          {item.source}
        </Tags>
      </div>

      <div>
        <Typography variant="body2">
          APY{' '}
          <CustomPopover contentClassName={classes.popover}>
            <APYTooltip
              dailyAPY={item.dailyAPY}
              weeklyAPY={item.weeklyAPY}
              yearlyAPY={item.yearlyAPY}
            />
          </CustomPopover>
        </Typography>
        <Typography variant="subtitle1">
          {item.gaugeInfo.fullYearlyAPY?.toFixed(2)}%
        </Typography>
      </div>

      <div>
        <Typography variant="body2">
          TVL{' '}
          <CustomPopover contentClassName={classes.popover}>
            <TVLTooltip icon={SNOB_LOCK_IMAGE_PATH} />
          </CustomPopover>
        </Typography>
        <Typography variant="subtitle1">${item.tvlStaked.toFixed(2)}</Typography>
      </div>

      <div>
        <Typography variant="body2">
          Boost{' '}
          <CustomPopover contentClassName={classes.popover}>
            <Info icon={BOOST_INFO_IMAGE_PATH} buttonText="More info" boost={userBoost} />
          </CustomPopover>
        </Typography>
        <Tags type="snowball">{userBoost}</Tags>
      </div>
    </div>
  );
};

export default memo(DetailItem);
