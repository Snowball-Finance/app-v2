
import { memo, useMemo, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, useMediaQuery } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'

import SnowConfirmDialog from 'parts/SnowConfirmDialog'
import SnowDialog from 'components/SnowDialog'
import WalletCard from 'components/WalletModal/WalletCard'
import { walletlink, injected } from 'utils/constants/connectors'
import ANIMATIONS from 'utils/constants/animate-icons';

const DESKTOP_CONNECTORS = {
  'MetaMask': injected,
  'Coinbase Wallet': walletlink,
  'Coin98': injected,
}

const MOBILE_CONNECTORS = {
  'MetaMask': injected,
  'Coinbase Wallet': walletlink,
  'Coin98': injected,
}

const useStyles = makeStyles(() => ({
  installContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

const WalletModal = ({
  open,
  onClose,
  onConnectWallet
}) => {
  const { connector } = useWeb3React();
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'), { defaultMatches: true });

  const walletConnectors = useMemo(() => isSm ? MOBILE_CONNECTORS : DESKTOP_CONNECTORS, [isSm]);
  const [openModal, setOpen] = useState(false)

  const walletSelectHandler = (currentConnector, name) => {
    if(name == 'Coin98') {
      if (!window.ethereum.isCoin98 && !window.coin98) {
        setOpen(true)
        return;
      }
    }
    onConnectWallet(currentConnector);
    onClose();
  }

  return (
    <>
    <SnowDialog
      open={open}
      onClose={onClose}
      title='Select a Wallet'
    >
      <Grid container spacing={2} className={classes.container} >
        {Object.keys(walletConnectors).map(name => {
          const currentConnector = walletConnectors[name]
          return (
            <Grid key={name} item xs={12} onClick={() => walletSelectHandler(currentConnector, name)}>
              <WalletCard
                selected={currentConnector === connector}
                name={name}
              />
            </Grid>
          )
        })}
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
