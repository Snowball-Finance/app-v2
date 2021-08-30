import { ethers } from 'ethers'
import { AVALANCHE_MAINNET_PARAMS, injected, PRIVATENODE } from 'utils/constants/connectors';
import MESSAGES from 'utils/constants/messages';
import { UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError as UserRejectedRequestErrorInjected } from '@web3-react/injected-connector'

const isServer = () => typeof window === 'undefined';

const isEmpty = value => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

const delay = ms => new Promise(res => setTimeout(res, ms));

const addAvalancheNetwork = () => {
  injected.getProvider().then(provider => {
    provider
      .request({
        method: 'wallet_addEthereumChain',
        params: [AVALANCHE_MAINNET_PARAMS]
      })
      .catch((error) => {
        console.log(error)
      })
  })
};

const handleConnectionError = (error) => {
  if (error instanceof NoEthereumProviderError) {
    return {
      message: MESSAGES.CONNECT_NO_ETHEREUM_PROVIDER_ERROR,
      button: 'Download Metamask',
      confirmAction: metaMaskInstallHandler
    }
  } else if (error instanceof UnsupportedChainIdError) {
    return {
      message: MESSAGES.CONNECT_UNSUPPORTED_CHAIN_ID_ERROR,
      button: 'Switch to Avalanche',
      confirmAction: addAvalancheNetwork
    }
  } else if (
    error instanceof UserRejectedRequestErrorInjected
  ) {
    return {
      message: MESSAGES.CONNECT_ACCESS_AVALANCHE_ERROR,
      button: 'OK'
    }
  } else {
    return {
      message: MESSAGES.CONNECT_UNKNOWN_ERROR,
      button: 'OK'
    }
  }
}

const metaMaskInstallHandler = () => {
  window.open('https://metamask.io/download', '_blank');
}

const nodeIsHealthy = async (url) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({"jsonrpc":"2.0","id":1,"method":"health.getLiveness"});
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  try{
    const response = await fetch(`${url}/ext/health`, requestOptions);
    const bodyResponse = await response.json(); 
    return bodyResponse.result?.healthy;
  }catch(error){
    console.log(error);
    return false;
  }
}

const provider = new ethers.providers.getDefaultProvider(
  nodeIsHealthy(PRIVATENODE) 
  ? `${PRIVATENODE}/ext/bc/C/rpc` 
    :  AVALANCHE_MAINNET_PARAMS.rpcUrls[0]);

const roundDown = (value, decimals = 18) => {
  const valueString = value.toString();
  const integerString = valueString.split('.')[0];
  const decimalsString = valueString.split('.')[1];
  if (!decimalsString) {
    return integerString
  }
  return `${integerString}.${decimalsString.slice(0, decimals)}`;
}

export {
  isServer,
  isEmpty,
  delay,
  roundDown,
  provider,
  AVALANCHE_MAINNET_PARAMS,
  addAvalancheNetwork,
  handleConnectionError,
  metaMaskInstallHandler,
  nodeIsHealthy
}