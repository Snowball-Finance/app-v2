import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import SnowPairsIcon from 'components/SnowPairsIcon';

const useStyles = makeStyles((theme) => ({
  underlyingTokensLine: {
    display: 'flex',
    alignItems: 'center',
  },
}));


function UnderlyingTokenItem ({ pairsIcon, amount, symbol }) {
  const classes = useStyles();
  return (
    <Typography variant="subtitle2" className={classes.underlyingTokensLine} noWrap>
      <SnowPairsIcon pairsIcon={pairsIcon} size={20} /> &nbsp;
      {amount} &nbsp;<b>{symbol}</b>
    </Typography>
  );
}

export default memo(UnderlyingTokenItem);