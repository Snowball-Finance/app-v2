import { memo } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useWallets } from 'contexts/wallet-context'
import SnowIdenticon from 'components/SnowIdenticon'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import getEllipsis from 'utils/helpers/getEllipsis'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px 16px 16px 10px',
    backgroundColor: 'rgba(40, 162, 255, 0.12)',
  },
  account: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: theme.spacing(0, 1),
    fontSize: '14px',
  },
  connect: {
    margin: theme.spacing(0, 1)
  }
}));

const ConnectWallet = () => {
  const classes = useStyles()
  const { setIsWalletDialog } = useWallets()
  const { account, active, error, deactivate } = useWeb3React();

  const walletHandler = () => {
    if ((active || error)) {
      deactivate();
      return
    }
    setIsWalletDialog(true)
  }

  return (
    (active || error)
      ? (
        <div
          className={classes.root}
          onClick={walletHandler}
        >
          <Typography
            variant='caption'
            color='textPrimary'
            className={classes.account}
          >
            {getEllipsis(account || '')}
          </Typography>
          <SnowIdenticon value={account} />

        </div>
      ) : (
        <ContainedButton
          className={classes.connect}
          onClick={walletHandler}
        >
          Connect
        </ContainedButton>
      )
  );
};

export default memo(ConnectWallet);
