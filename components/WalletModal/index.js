
import { memo, useMemo } from 'react'
import { UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Typography, useMediaQuery } from '@material-ui/core'
import { useWeb3React } from '@web3-react/core'

import SnowDialog from 'components/SnowDialog'
import WalletCard from 'components/WalletModal/WalletCard'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import { walletlink, injected } from 'utils/constants/connectors'
import MESSAGES from 'utils/constants/messages'

const DESKTOP_CONNECTORS = {
  'MetaMask': injected,
  'WalletLink': walletlink,
}

const MOBILE_CONNECTORS = {
  'MetaMask': injected,
  'WalletLink': walletlink,
}

const getErrorMessage = (error) => {
  if (error instanceof NoEthereumProviderError) {
    return MESSAGES.CONNECT_NO_ETHEREUM_PROVIDER_ERROR
  } else if (error instanceof UnsupportedChainIdError) {
    return MESSAGES.CONNECT_UNSUPPORTED_CHAIN_ID_ERROR
  } else if (
    error instanceof UserRejectedRequestErrorInjected
  ) {
    return MESSAGES.CONNECT_ACCESS_BINANCE_ERROR
  } else {
    return MESSAGES.CONNECT_UNKNOWN_ERROR
  }
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

  const metaMaskInstallHandler = () => {
    window.open('https://metamask.io/download', '_blank');
  }

  const walletSelectHandler = (currentConnector) => {
    onConnectWallet(currentConnector)
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
        {(error instanceof NoEthereumProviderError) && (
          <Grid item xs={12} className={classes.installContainer}>
            <ContainedButton onClick={() => metaMaskInstallHandler()} >
              Install Metamask
            </ContainedButton>
          </Grid>
        )}
        {!!error &&
          <Grid item xs={12}>
            <Typography color='error' variant='body2' align='center'>
              {getErrorMessage(error)}
            </Typography>
          </Grid>
        }
      </Grid>
    </SnowDialog>
  );
}

export default memo(WalletModal);
