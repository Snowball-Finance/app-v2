import { memo } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SnowTokenIcon from 'components/SnowTokenIcon';
import CustomPopover from 'components/CustomPopover';
import Tags from 'components/Tags';
import SnowPairsIcon from 'components/SnowPairsIcon';
import Info from '../Info';
import TVLTooltip from '../TVLTooltip';
import APYTooltip from '../APYTooltip';
import { BOOST_INFO_IMAGE_PATH, SNOB_LOCK_IMAGE_PATH } from 'utils/constants/image-paths';

const useStyles = makeStyles((theme) => ({
  popover: {
    backgroundColor: theme.custom.palette.lightBlue,
    '&::before': {
      backgroundColor: theme.custom.palette.lightBlue,
    },
  },
  boost: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const DetailItem = ({ item, userBoost, totalAPY }) => {
  const classes = useStyles();
  const token0 = item.token0.address;
  const token1 = item.token1.address;
  const token2 = item.token2.address;
  const dexTokenName = item.source == "Pangolin" ? "PNG" : item.source == "Trader Joe" ? "JOE" : "SNOB";

  return (
    <Grid
      container
      direction="row"
      justify='space-between'
      alignItems="center"
      spacing={4}
    >
      <Grid item xs={3}>
        <SnowPairsIcon pairsIcon={[token0, token1, token2]} size={50} />
      </Grid>

      <Grid item xs={2}>
        <Typography variant="subtitle2">{item.name}</Typography>
        <Grid item xs={12} xl={7} md={12} lg={12}>
          <Tags type={dexTokenName}>
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item xs={2}>
                <SnowTokenIcon size={12} token={dexTokenName} />
              </Grid>
              <Grid item>
                {item.source}
              </Grid>
            </Grid>
          </Tags>
        </Grid>
      </Grid>

      <Grid item xs={2}>
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
          {totalAPY?.toFixed(2)}%
        </Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography variant="body2">
          TVL{' '}
          <CustomPopover contentClassName={classes.popover}>
            <TVLTooltip icon={SNOB_LOCK_IMAGE_PATH} />
          </CustomPopover>
        </Typography>
        <Typography variant="subtitle1">${item.tvlStaked.toFixed(2)}</Typography>
      </Grid>

      <Grid item xs={2}>
        <Typography variant="body2">
          Boost{' '}
          <CustomPopover contentClassName={classes.popover}>
            <Info icon={BOOST_INFO_IMAGE_PATH} buttonText="More info" boost={userBoost} />
          </CustomPopover>
        </Typography>
        <Grid item xs={6} xl={3} md={3} lg={4}>
          <Tags type="SNOB" className={classes.boost}>{userBoost}</Tags>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(DetailItem);
