
import { memo, useMemo, useState, useCallback, useEffect } from 'react'
import { Card, Typography, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ethers } from 'ethers'

import { CONTRACTS } from 'config'
import { useContracts } from 'contexts/contract-context'
import { usePrices } from 'contexts/price-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import {
  DASHBOARD_COMPOUND_BACKGROUND_IMAGE_PATH,
  METAMASK_IMAGE_PATH
} from 'utils/constants/image-paths'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(2),
    backgroundImage: `url(${DASHBOARD_COMPOUND_BACKGROUND_IMAGE_PATH})`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'right',
    backgroundPositionY: 'bottom',
    height: '100%'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(3.5)
  },
  snob: {
    fontSize: 48,
    fontWeight: 'bold',
    '& span': {
      fontSize: 16,
      fontWeight: 400
    }
  },
  button: {
    margin: theme.spacing(3, 0)
  },
  divider: {
    height: 1,
    margin: theme.spacing(3, 0)
  },
  accountContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    }
  },
  balance: {
    fontSize: 18,
    color: theme.palette.text.secondary,
    '& span': {
      fontSize: 12,
      color: theme.palette.text.primary
    }
  },
  addMetamask: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(2)
    }
  },
  metamaskIcon: {
    marginRight: theme.spacing(1)
  }
}));

const CompoundAndEarn = () => {
  const classes = useStyles();
  const [pendingHarvest, setPendingHarvest] = useState({});
  const { snowballBalance, gauges } = useContracts();
  const { prices } = usePrices();

  const snowballPrice = useMemo(() => prices.snowball * snowballBalance, [prices, snowballBalance]);

  const addMetamask = async () => {
    const provider = window.ethereum
    if (provider) {
      try {
        await provider.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: CONTRACTS.SNOWBALL,
              symbol: 'SNOB',
              decimals: '18',
              image: '',
            },
          },
        })
      } catch (error) {
        console.log('Error => addMetamask')
      }
    }
  }

  const getTotalPendingHarvest = useCallback(() => {
    let total = 0;
    gauges.map((gauge) => {
      total =
        total + parseFloat(ethers.utils.formatUnits(gauge.harvestable, 18));
    });
    const balanceUSD = +(total * prices.snowball).toFixed(2);
    setPendingHarvest({ amount: total.toFixed(2), balanceUSD });
  }, [prices, gauges]);

  useEffect(() => {
    getTotalPendingHarvest();
  }, [gauges, getTotalPendingHarvest]);

  return (
    <Card className={classes.card}>
      <Typography
        variant='h5'
        color='textPrimary'
        className={classes.title}
      >
        Compound & Earn
      </Typography>
      <Typography
        variant='body2'
        color='textPrimary'
      >
        Pending to harvest
      </Typography>
      <Typography
        color='textPrimary'
        className={classes.snob}
      >
        {pendingHarvest?.amount?.toLocaleString()} <span>SNOB</span>
      </Typography>
      <Typography
        variant='h6'
        color='textSecondary'
      >
        ${parseFloat(pendingHarvest?.balanceUSD).toFixed(3)} USD
      </Typography>
      <ContainedButton className={classes.button}>
        HARVEST
      </ContainedButton>

      <Divider
        flexItem
        orientation='horizontal'
        className={classes.divider}
      />

      <div className={classes.accountContainer}>
        <div>
          <Typography
            variant='body2'
            color='textPrimary'
          >
            Wallet balance
          </Typography>
          <Typography className={classes.balance}>
            {snowballBalance.toLocaleString()} SNOB<span>$ {snowballPrice.toFixed(3)}</span>
          </Typography>
          <Typography
            variant='caption'
            color='textPrimary'
          >
            In Governance: 0.000
          </Typography>
        </div>

        <ContainedButton
          color='secondary'
          className={classes.addMetamask}
          onClick={addMetamask}
        >
          <img
            alt='metamask'
            src={METAMASK_IMAGE_PATH}
            className={classes.metamaskIcon}
          />
          Add SNOB to Metamask
        </ContainedButton>
      </div>
    </Card>
  )
}

export default memo(CompoundAndEarn);