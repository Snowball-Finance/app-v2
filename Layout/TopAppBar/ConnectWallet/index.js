import { memo, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core';
import { Typography } from '@material-ui/core'

import { injected } from 'libs/web3-connectors'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import useEagerConnect from 'utils/hooks/useEagerConnect'
import useInactiveListener from 'utils/hooks/useInactiveListener'
import getEllipsis from 'utils/helpers/getEllipsis'

const ConnectWallet = ({
  className
}) => {
  const [activatingConnector, setActivatingConnector] = useState();

  const {
    account,
    connector,
    activate,
    deactivate,
    active,
    error
  } = useWeb3React();

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const walletHandler = () => {
    if ((active || error)) {
      deactivate();
      return
    }
    setActivatingConnector(injected);
    activate(injected);
  }

  return (
    <>
      {account &&
        <Typography
          variant='caption'
          color='textPrimary'
        >
          {getEllipsis(account)}
        </Typography>
      }
      <ContainedButton
        className={className}
        onClick={walletHandler}
      >
        {(active || error) ? 'Disconnect' : 'Connect'}
      </ContainedButton>
    </>
  );
};

export default memo(ConnectWallet);
