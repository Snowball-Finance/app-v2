
import { memo } from 'react'
import {
  Card,
  Grid,
  Typography,
  TableCell,
  TableRow,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ChartUpIcon from 'components/Icons/ChartUpIcon'
import ChartDownIcon from 'components/Icons/ChartDownIcon'
import TableContainer from './TableContainer'
import LP_ICONS from 'utils/constants/lp-icons'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '100%'
  },
  cell: {
    padding: theme.spacing(1)
  },
  tokenContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  tokenImage: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    objectFit: 'container',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  token: {
    fontSize: 12,
    marginLeft: theme.spacing(1),
    '& span': {
      fontSize: 14,
      fontWeight: 'bold'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  locked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  balance: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: theme.spacing(2)
  }
}));

const TokenPairs = () => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <TableContainer>
        {pairs.map((pair, index) => (
          <TableRow key={index}>
            <TableCell component='th' scope='row' className={classes.cell}>
              <Grid container spacing={2}>
                {pair.tokens.map((token, index) => (
                  <Grid item xs={4} key={index} className={classes.tokenContainer}>
                    <img
                      alt='token-icon'
                      src={LP_ICONS[token.priceId]}
                      className={classes.tokenImage}
                    />
                    <Typography
                      color='textPrimary'
                      className={classes.token}
                    >
                      <span>{token.name}</span>
                      <br />
                      {`${token.price}USD`}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </TableCell>
            <TableCell align='right' className={classes.cell}>
              <div className={classes.locked}>
                <Typography
                  color='textPrimary'
                  className={classes.balance}
                >
                  {`$${pair.balance.toLocaleString()}`}
                </Typography>
                {pair.isUp ? <ChartUpIcon /> : <ChartDownIcon />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableContainer>
    </Card>
  )
}

export default memo(TokenPairs);

const pairs = [
  {
    tokens: [
      {
        name: 'Tether USD',
        priceId: 'usdt',
        price: '1.000'
      },
      {
        name: 'DAI',
        priceId: 'dai',
        price: '0.9996'
      },
      {
        name: 'BUSD',
        priceId: 'busd',
        price: '1.311'
      }
    ],
    balance: 891.2,
    isUp: false
  },
  {
    tokens: [
      {
        name: 'Frax',
        priceId: 'frax',
        price: '0.9978'
      },
      {
        name: 'TrueUSD',
        priceId: 'tusd',
        price: '0.9708'
      },
      {
        name: 'Tether USD',
        priceId: 'usdt',
        price: '1.000'
      }
    ],
    balance: 893847,
    isUp: true
  },
  {
    tokens: [
      {
        name: 'Wrapped BTC',
        priceId: 'wbtc',
        price: '54900'
      },
      {
        name: 'Wrapped Avax',
        priceId: 'wavax',
        price: '33.43'
      },
    ],
    balance: 38052,
    isUp: true
  },
  {
    tokens: [
      {
        name: 'Wrapped BTC',
        priceId: 'wbtc',
        price: '54900'
      },
      {
        name: 'Pangolin',
        priceId: 'png',
        price: '3.932'
      },
    ],
    balance: 78076,
    isUp: true
  },
  {
    tokens: [
      {
        name: 'Sushi Token',
        priceId: 'sushi',
        price: '13.31'
      },
      {
        name: 'Pangolin',
        priceId: 'png',
        price: '3.932'
      },
    ],
    balance: 23266,
    isUp: true
  },
  {
    tokens: [
      {
        name: 'Snowball',
        priceId: 'snowball',
        price: '0.4843'
      },
      {
        name: 'Wrapped Avax',
        priceId: 'wavax',
        price: '33.43'
      },
    ],
    balance: 1973372,
    isUp: true
  },
  {
    tokens: [
      {
        name: 'Wrapped Avax',
        priceId: 'wavax',
        price: '33.43'
      },
      {
        name: 'Ethereum',
        priceId: 'ether',
        price: '3243'
      },
    ],
    balance: 59072,
    isUp: true
  }
]