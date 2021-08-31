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
    borderRadius: '10px',
    backgroundColor: '#E5F3FF',
  },
  account: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '7px 10px',
    fontSize: 14,
    fontWeight: '600'
  },
  connect: {
    margin: '0px'
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
