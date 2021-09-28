import { memo } from 'react';
import { Card, Grid, Typography, TableCell, TableRow } from '@material-ui/core';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import { makeStyles } from '@material-ui/core/styles';
import TableContainer from './TableContainer';

import ChartUpIcon from 'components/Icons/ChartUpIcon';
import ChartDownIcon from 'components/Icons/ChartDownIcon';
import { useAPIContext } from 'contexts/api-context';
import TokenPairsSkeleton from './TokenPairsSkeleton';
import TokenPairItem from './TokenPairItem';
import { formatNumber } from 'utils/helpers/format';

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%',
    backgroundColor: theme.palette.background.primary,
  },
  cell: {
    padding: theme.spacing(1),
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

const TokenPairs = () => {
  const classes = useStyles();
  const { getPairsInfo } = useAPIContext();
  const pairsInfoQuery = getPairsInfo();

  if (pairsInfoQuery.error) {
    return <div>Something went wrong...</div>;
  }

  return (
    <Card className={classes.card}>
      <TableContainer>
        {pairsInfoQuery.loading
          ? <TokenPairsSkeleton />
          : (pairsInfoQuery.data?.MultiplePairsInfo[0].pairs.map((pair) => (
            <TableRow key={pair.name}>
              <TableCell component="th" scope="row" className={classes.cell}>
                <Grid container spacing={1}>
                  {pair.token0.address && <TokenPairItem token={pair.token0} />}
                  {pair.token1.address && <TokenPairItem token={pair.token1} />}
                  {pair.token2.address && <TokenPairItem token={pair.token2} />}
                  {pair.token3.address && <TokenPairItem token={pair.token3} />}
                </Grid>
              </TableCell>
              <TableCell align="right" className={classes.cell}>
                <div className={classes.locked}>
                  <Typography color="textPrimary" className={classes.balance}>
                    {`$${formatNumber(pair.tvlStaked, 2)}`}
                  </Typography>
                  {renderChartIcon(pair.status)}
                </div>
              </TableCell>
            </TableRow>
          )))
        }
      </TableContainer>
    </Card>
  );
};

export default memo(TokenPairs);
