import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import CustomPopover from 'components/CustomPopover';
import APYTooltip from '../../CompoundListItem/APYTooltip';
import BaseAPRTooltip from './BaseAPRTooltip';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  boldSubtitle: {
    fontWeight: 600,
  },
  percentValue: {
    marginLeft: 'auto',
  },
  popover: {
    backgroundColor: theme.custom.palette.blueContainer,
    '&::before': {
      backgroundColor: theme.custom.palette.blueContainer,
    },
  },
}));

const ApyCalculation = ({
  dailyAPR,
  weeklyAPY,
  yearlyAPY,
  kind
}) => {
  const classes = useStyles();

  return (
    <Grid className={classes.root}>
      <Typography variant="subtitle1" className={classes.boldSubtitle}>
        {kind === 'Snowglobe' ? 'Compounded APY' : 'Fees APR'}
      </Typography>
      <div className={classes.container}>
        <Typography variant="body2">Base APR</Typography>
        <CustomPopover contentClassName={classes.popover}>
          <BaseAPRTooltip
            dailyAPR={dailyAPR}
          />
        </CustomPopover>
        <Typography variant="subtitle2" className={classes.percentValue}>
          {typeof(dailyAPR) === 'number' ? (dailyAPR * 365)?.toFixed(2) : dailyAPR}%
        </Typography>
      </div>
      {kind === 'Snowglobe' &&<div className={classes.container}>
        <Typography variant="body2">Compounded APY</Typography>
        <CustomPopover contentClassName={classes.popover}>
          <APYTooltip
            dailyAPY={dailyAPR}
            weeklyAPY={weeklyAPY}
            yearlyAPY={yearlyAPY}
          />
        </CustomPopover>
        <Typography variant="subtitle2" className={classes.percentValue}>{typeof(yearlyAPY) === 'number' ? yearlyAPY?.toFixed(2): yearlyAPY}%</Typography>
      </div>}
    </Grid>
  );
};

export default memo(ApyCalculation);
