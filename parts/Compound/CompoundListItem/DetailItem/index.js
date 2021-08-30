import { memo } from 'react';
import { Typography, Grid, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import SnowTokenIcon from 'components/SnowTokenIcon';
import CustomPopover from 'components/CustomPopover';
import Tags from 'components/Tags';
import SnowPairsIcon from 'components/SnowPairsIcon';
import Info from '../Info';
import TVLTooltip from '../TVLTooltip';
import APYTooltip from '../APYTooltip';
import {
  BOOST_INFO_IMAGE_PATH,
  SNOB_LOCK_IMAGE_PATH,
} from 'utils/constants/image-paths';

const useStyles = makeStyles((theme) => ({
  popover: {
    backgroundColor: theme.custom.palette.lightBlue,
    '&::before': {
      backgroundColor: theme.custom.palette.lightBlue,
    },
  },
  boost: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const DetailItem = ({ item, userBoost, totalAPY }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const token0 = item.token0.address;
  const token1 = item.token1.address;
  const token2 = item.token2.address;
  const token3 = item.token3.address;
  const dexTokenName =
    item.source == 'Pangolin'
      ? 'PNG'
      : item.source == 'Trader Joe'
      ? 'JOE'
      : item.source == 'BENQI'
      ? 'BENQI'
      : 'SNOB';

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      spacing={isSm ? 1 : 4}
    >
      <Grid item xs={4} lg={3}>
        <SnowPairsIcon
          pairsIcon={[token0, token1, token2, token3]}
          size={isSm ? 30 : 50}
        />
      </Grid>

      <Grid item xs={8} lg={2}>
        <Grid container direction={isSm ? 'row' : 'column'}>
          <Grid item xs={6} xl={7} md={12} lg={12}>
            <Typography variant="subtitle2">{item.name}</Typography>
          </Grid>
          <Grid item xs={6} xl={7} md={12} lg={12}>
            <Tags type={dexTokenName}>
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item xs={2}>
                  <SnowTokenIcon size={12} token={dexTokenName} />
                </Grid>
                <Grid item>{item.source}</Grid>
              </Grid>
            </Tags>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} lg={2}>
        <Grid
          container
          direction={isSm ? 'row' : 'column'}
          justify={isSm ? 'space-between' : 'flex-start'}
        >
          <Grid item>
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
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              {typeof totalAPY === 'number' ? totalAPY?.toFixed(2) : totalAPY}%
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} lg={2}>
        <Grid
          container
          direction={isSm ? 'row' : 'column'}
          justify={isSm ? 'space-between' : 'flex-start'}
        >
          <Grid item>
            <Typography variant="body2">
              TVL{' '}
              <CustomPopover contentClassName={classes.popover}>
                <TVLTooltip icon={SNOB_LOCK_IMAGE_PATH} />
              </CustomPopover>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              ${item.tvlStaked.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} lg={2}>
        <Grid
          container
          direction={isSm ? 'row' : 'column'}
          justify={isSm ? 'space-between' : 'flex-start'}
        >
          <Grid item>
            <Typography variant="body2">
              Boost{' '}
              <CustomPopover contentClassName={classes.popover}>
                <Info
                  icon={BOOST_INFO_IMAGE_PATH}
                  buttonText="More info"
                  boost={userBoost}
                />
              </CustomPopover>
            </Typography>
          </Grid>
          <Grid item xs={6} xl={3} md={3} lg={4}>
            <Tags type="SNOB" className={classes.boost}>
              {userBoost}
            </Tags>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(DetailItem);
