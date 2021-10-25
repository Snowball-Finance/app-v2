import { memo } from 'react';
import { Typography, Grid, useMediaQuery, Box } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import SnowTokenIcon from 'components/SnowTokenIcon';
import CustomPopover from 'components/CustomPopover';
import Tags from 'components/Tags';
import SnowPairsIcon from 'components/SnowPairsIcon';
import Info from '../Info';
import TVLTooltip from '../TVLTooltip';
import APYTooltip from '../APYTooltip';
import { formatNumber } from 'utils/helpers/format';
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
  const dexTokenName = item.symbol == "S4D" ? "SNOB" : item.symbol;

  return (
    <Grid
      container
      direction="column"
      display="flex"
    >
        {item.deprecatedPool && <Typography align="center" color="error">
          This pool is deprecated and don{`'`}t receive rewards anymore, please withdraw from it.
        </Typography>}
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={isSm ? 1 : 4}
      >
        {!item.deprecatedPool && <Grid item xs={4} lg={3} xl={3}>
          <SnowPairsIcon
            pairsIcon={[item.token0.address, item.token1.address, item.token2.address, item.token3.address]}
          />
        </Grid>}
        <Grid item xs={8} lg={2} xl={3}>
          <Grid container direction={isSm ? 'row' : 'column'}>
            <Grid item xs={6} xl={6} md={12} lg={12}>
              <Typography variant="subtitle2">{item.name}</Typography>
            </Grid>
            <Grid item xs={6} xl={6} md={12} lg={12}>
              <Tags type={dexTokenName}>
                <Box display='flex' alignItems='center'>
                  <SnowTokenIcon size={12} token={dexTokenName} />
                  &nbsp;&nbsp;{item.source}
                </Box>
              </Tags>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={2}>
        {!item.deprecatedPool && <Grid
            container
            direction={isSm ? 'row' : 'column'}
            justify={isSm ? 'space-between' : 'flex-start'}
          >
            <Grid item>
              <Typography variant="body2">
                {item.kind === 'Snowglobe' ? 'APY ' : 'APR '}
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
          </Grid>}
        </Grid>

        {!item.deprecatedPool && <Grid item xs={12} lg={2}>
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
                ${formatNumber(item.tvlStaked, 2)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>}

        {!item.deprecatedPool &&<Grid item xs={12} lg={2}>
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
        </Grid>}
      </Grid>
    </Grid>
  );
};

export default memo(DetailItem);
