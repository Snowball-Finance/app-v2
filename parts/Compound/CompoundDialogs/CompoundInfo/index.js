import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ArrowDownIcon from 'components/Icons/ArrowDownIcon';
import SnowPairsIcon from 'components/SnowPairsIcon';
import SnowTokenIcon from 'components/SnowTokenIcon';

const useStyles = makeStyles((theme) => ({
  downArrow: {
    marginTop: theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  },
  container: {
    marginTop: theme.spacing(1),
    borderWidth: 1,
    borderColor: theme.custom.palette.border,
    borderStyle: 'solid',
    borderRadius: 7,
    padding: theme.spacing(2),
  },
  pairLine: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  amountText: {
    marginLeft: 'auto',
  },
  tokenLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  pairInfoStyle: {
    marginLeft: theme.spacing(1),
  },
  estContainer: {
    marginTop: theme.spacing(1.5),
  },
  bold: {
    fontWeight: 600
  }
}));

const CompoundInfo = ({
  pool,
}) => {
  const classes = useStyles();
  const token0 = pool.token0.address;
  const token1 = pool.token1.address;
  const token2 = pool.token2.address;
  const token3 = pool.token3.address;
  console.log('pool ==>', pool);

  return (
    <>
      <ArrowDownIcon className={classes.downArrow} />
      <div className={classes.container}>
        <div className={classes.pairLine}>
          <SnowPairsIcon pairsIcon={['0x5947BB275c521040051D82396192181b413227A3', '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7']} size={36} />
          <div className={classes.pairInfoStyle}>
            <Typography variant='subtitle1'>To</Typography>
            <Typography variant='subtitle1' className={classes.bold}>
              LINK-AVAX {pool.symbol}
            </Typography>
          </div>
          <Typography className={classes.amountText}>0.00</Typography>
        </div>
        <div className={classes.estContainer}>
          <Typography className={classes.bold} variant='subtitle1' gutterBottom>Est. pool allocation</Typography>
          <Box className={classes.tokenLine}>
            <SnowTokenIcon token='WAVAX' size={20} />
            <Typography className={classes.pairInfoStyle}>AVAX</Typography>
            <Typography className={classes.amountText}>0.00</Typography>
          </Box>
          <Box className={classes.tokenLine} mb={1}>
            <SnowTokenIcon token='LINK' size={20} />
            <Typography className={classes.pairInfoStyle}>LINK</Typography>
            <Typography className={classes.amountText}>0.00</Typography>
          </Box>
          <Box className={classes.tokenLine} >
            <Typography>Protocol</Typography>
            <Typography className={classes.bold}>{pool.source}</Typography>
          </Box>
        </div>
      </div>
    </>
  );
};

export default memo(CompoundInfo);
