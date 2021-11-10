import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from 'utils/constants/connectors'
import {addAvalancheNetwork} from "utils/helpers/utility";

const useEagerConnect = () => {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized()
      .then(isAuthorized => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      addAvalancheNetwork()
    }
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export default useEagerConnect;