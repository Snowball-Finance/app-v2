
import { memo, useMemo } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, useMediaQuery } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'

import SnowDialog from 'components/SnowDialog'
import WalletCard from 'components/WalletModal/WalletCard'
import { walletlink, injected } from 'utils/constants/connectors'

const DESKTOP_CONNECTORS = {
  'MetaMask': injected,
  'WalletLink': walletlink,
}

const MOBILE_CONNECTORS = {
  'MetaMask': injected,
  'WalletLink': walletlink,
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
  const { connector, error } = useWeb3React();
  const classes = useStyles();
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm'), { defaultMatches: true });

  const walletConnectors = useMemo(() => isSm ? MOBILE_CONNECTORS : DESKTOP_CONNECTORS, [isSm]);

  const walletSelectHandler = (currentConnector) => {
    onConnectWallet(currentConnector);
    onClose();
  }

  return (
    <SnowDialog
      open={open}
      onClose={onClose}
      title='Select a Wallet'
    >
      <Grid container spacing={2} className={classes.container} >
        {Object.keys(walletConnectors).map(name => {
          const currentConnector = walletConnectors[name]
          return (
            <Grid key={name} item xs={12} onClick={() => walletSelectHandler(currentConnector)}>
              <WalletCard
                selected={currentConnector === connector}
                name={name}
              />
            </Grid>
          )
        })}
      </Grid>
    </SnowDialog>
  );
}

export default memo(WalletModal);
