import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { formatNumber } from 'utils/helpers/format';
import CustomPopover from 'components/CustomPopover';
import SnobAPYTooltip from './SnobAPYTooltip';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldSubtitle: {
    fontWeight: 600,
  },
  gradientBorder: {
    marginTop: theme.spacing(1),
    width: '100%',
    height: '100%',
    border: 'double 1px transparent',
    borderRadius: 10,
    backgroundImage: `linear-gradient(${theme.palette.background.primary}, ${theme.palette.background.primary}), radial-gradient(circle at top left, #33A9FF,#264E86)`,
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    '& $container': {
      padding: theme.spacing(1),
    }
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

const SnobApyCalculation = ({ kind, isDeprecated, snobAPR, totalAPY, userBoost, userData }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {!isDeprecated && <>
        <Typography variant="subtitle1" className={classes.boldSubtitle}>
          SNOB APR
        </Typography>
        <div className={classes.container}>
          <Typography variant="body2">SNOB APR&nbsp;</Typography>
          <CustomPopover contentClassName={classes.popover}>
            <SnobAPYTooltip />
          </CustomPopover>
          <Typography variant="subtitle2" className={classes.percentValue}>{snobAPR?.toFixed(2)}%</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="body2">Boost</Typography>
          <Typography variant="subtitle2">{userBoost}</Typography>
        </div>
        <div className={classes.container}>
          <Typography variant="body2"><b>{kind === 'Snowglobe' ? 'Total APY' : 'Total APR'}</b></Typography>
          <Typography variant="subtitle2" className={classes.percentValue}>{typeof(totalAPY) === 'number' ? totalAPY?.toFixed(2) : totalAPY }%</Typography>
        </div>
      </>}
      <div className={classes.gradientBorder}>
        <div className={classes.container}>
          <Typography variant='subtitle2'>SNOB (Claimable)</Typography>
          <Typography variant='subtitle2'><b>{formatNumber(userData?.SNOBHarvestable || 0.00, 2)}</b> (${formatNumber(userData?.SNOBValue || 0.00, 2)})</Typography>
        </div>
      </div>
    </div>
  );
};

export default memo(SnobApyCalculation);
