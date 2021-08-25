import { memo } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import SnowPairsIcon from 'components/SnowPairsIcon';

const useStyles = makeStyles((theme) => ({
  tokenContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  token: {
    fontSize: 12,
    marginLeft: theme.spacing(1),
    '& span': {
      fontSize: 14,
      fontWeight: 'bold',
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

const TokenPairItem = ({
  token
}) => {
  const classes = useStyles();

  return (
    <Grid item xs={3} className={classes.tokenContainer}>
      <SnowPairsIcon size={50} pairsIcon={[token.address]} />
      <Typography color="textPrimary" className={classes.token}>
        <span>{token.name}</span>
        <br />
        {`${token.pangolinPrice?.toLocaleString()} USD`}
      </Typography>
    </Grid>
  );
};

export default memo(TokenPairItem);
