
import { memo, useEffect, useMemo, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, useMediaQuery, Link } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'

import SnowConfirmDialog from 'parts/SnowConfirmDialog'
import SnowDialog from 'components/SnowDialog'
import WalletCard from 'components/WalletModal/WalletCard'
import { walletlink, injected } from 'utils/constants/connectors'
import ANIMATIONS from 'utils/constants/animate-icons'

import { AnalyticActions, AnalyticCategories, createEvent, analytics } from "utils/analytics";

const DESKTOP_CONNECTORS = {
  'Core': injected,
  'MetaMask': injected,
  'Coinbase Wallet': walletlink,
  'Coin 98': injected,
}

const MOBILE_CONNECTORS = {
  'Core': injected,
  'MetaMask': injected,
  'Coinbase Wallet': walletlink,
  'Coin 98': injected,
}

const useStyles = makeStyles((theme) => ({
  installContainer: {
    padding: theme.spacing(3, 2),
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  label: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'start',
      fontSize: 14
    },
  }
}));

const WalletModal = ({
  open,
  onClose,
  onConnectWallet
}) => {
  useEffect(() => {
    if (open) {
      analytics.trackEvent(createEvent({
        category: AnalyticCategories.modal,
        action: AnalyticActions.wallet,
        name: 'open'
      }))
    }
    return () => {

    }
  }, [open])

  const { connector } = useWeb3React();
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'), { defaultMatches: true });

  const walletConnectors = useMemo(() => isSm ? MOBILE_CONNECTORS : DESKTOP_CONNECTORS, [isSm]);
  const [openModal, setOpen] = useState(false)

  const walletSelectHandler = (currentConnector, name) => {
    console.log(currentConnector, name);
    if (name == 'Coin 98') {
      if (!window.ethereum.isCoin98 && !window.coin98) {
        setOpen(true)
        return;
      } else {
        onConnectWallet(currentConnector);
        onClose();
      }
    } else {
      onConnectWallet(currentConnector);
      onClose();
    }
  }

  return (
    <>
      <SnowDialog
        open={open}
        onClose={onClose}
        title='Connect Wallet'
      >
        <Grid
          container
          spacing={2}
          className={classes.installContainer}
          direction='row'
          justify='left'
          alignItems='stretch'
        >
          {Object.keys(walletConnectors).map(name => {
            const currentConnector = walletConnectors[name]
            return (
              <Grid
                key={name}
                item
                lg={3}
                md={3}
                xs={12}
                sm={12}
                onClick={() => walletSelectHandler(currentConnector, name)}
              >
                <WalletCard
                  selected={currentConnector === connector}
                  name={name}
                />
              </Grid>
            )
          })}

          <Grid item xs={12}>
            <Typography variant='body1' className={classes.label}>New to avalanche</Typography>
            <Link component='button' variant='body1' underline='none' className={classes.label}>+ Add Avalanche Network to Metamask</Link>
          </Grid>
        </Grid>
      </SnowDialog>
      <SnowConfirmDialog
        open={openModal}
        onClose={() => setOpen(false)}
        title='Warning'
        text="You need to install Coin98 Wallet Extention"
        icon={ANIMATIONS.WARNING.VALUE}
      />
    </>
  );
}

export default memo(WalletModal);
