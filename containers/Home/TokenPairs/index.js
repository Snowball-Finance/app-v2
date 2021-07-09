import { memo } from 'react';
import { Card, Grid, Typography, TableCell, TableRow } from '@material-ui/core';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';

import ChartUpIcon from 'components/Icons/ChartUpIcon';
import ChartDownIcon from 'components/Icons/ChartDownIcon';
import DashboardTokenPairsSkeleton from 'components/Skeletons/DashboardTokenPairs';
import { MULTIPLE_PAIRS_INFO } from 'api/dashboard/queries';
import TableContainer from './TableContainer';
import SnowPairsIcon from 'components/SnowPairsIcon';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
  },
  cell: {
    padding: theme.spacing(1),
  },
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
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  locked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  balance: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: theme.spacing(2),
  },
}));

const TokenPairs = () => {
  const classes = useStyles();
  const { data, loading, error } = useQuery(MULTIPLE_PAIRS_INFO, {
    variables: { first: 1, grouped: true },
  });

  if (error) {
    return <div>Something went wrong...</div>;
  }

  const loadingTable = () => {
    return [1, 2, 3, 4].map((item) => (
      <TableRow key={item}>
        <TableCell>
          <DashboardTokenPairsSkeleton />
        </TableCell>
      </TableRow>
    ));
  };

  const renderChartIcon = (status) => {
    switch (status) {
      case 'gain':
        return <ChartUpIcon />;
      case 'loss':
        return <ChartDownIcon />;
      case 'even':
        return <TrendingFlatIcon color="primary" />;
      default:
        return null;
    }
  };

  const renderTableData = (data) => {
    return data.map((pair) => (
      <TableRow key={pair.name}>
        <TableCell component="th" scope="row" className={classes.cell}>
          <Grid container spacing={2}>
            {pair.token0.address && (
              <Grid item xs={4} className={classes.tokenContainer}>
                <SnowPairsIcon size={50} pairsIcon={[pair.token0.address]} />
                <Typography color="textPrimary" className={classes.token}>
                  <span>{pair.token0.name}</span>
                  <br />
                  {`${pair.token0.pangolinPrice?.toLocaleString()}USD`}
                </Typography>
              </Grid>
            )}
            {pair.token1.address && (
              <Grid item xs={4} className={classes.tokenContainer}>
                <SnowPairsIcon size={50} pairsIcon={[pair.token1.address]} />
                <Typography color="textPrimary" className={classes.token}>
                  <span>{pair.token1.name}</span>
                  <br />
                  {`${pair.token1.pangolinPrice?.toLocaleString()}USD`}
                </Typography>
              </Grid>
            )}
            {pair.token2.address && (
              <Grid item xs={4} className={classes.tokenContainer}>
                <SnowPairsIcon size={50} pairsIcon={[pair.token2.address]} />
                <Typography color="textPrimary" className={classes.token}>
                  <span>{pair.token2.name}</span>
                  <br />
                  {`${pair.token2.pangolinPrice?.toLocaleString()}USD`}
                </Typography>
              </Grid>
            )}
          </Grid>
        </TableCell>
        <TableCell align="right" className={classes.cell}>
          <div className={classes.locked}>
            <Typography color="textPrimary" className={classes.balance}>
              {`$${pair.tvlStaked.toLocaleString()}`}
            </Typography>
            {renderChartIcon(pair.status)}
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Card className={classes.card}>
      <TableContainer>
        {loading
          ? loadingTable()
          : renderTableData(data?.MultiplePairsInfo[0].pairs)}
      </TableContainer>
    </Card>
  );
};

export default memo(TokenPairs);
