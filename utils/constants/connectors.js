
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { ethers } from 'ethers';

const PRIVATENODE = process.env.PRIVATENODE;

const AVALANCHE_MAINNET_PARAMS = {
  chainId: '0xa86a',
  chainName: 'Avalanche Mainnet C-Chain',
  nativeCurrency: {
      name: 'Avalanche',
      symbol: 'AVAX',
      decimals: 18
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://cchain.explorer.avax.network/']
}

//add fallback
var providers = [
  {
    provider: new ethers.providers.StaticJsonRpcProvider(AVALANCHE_MAINNET_PARAMS.rpcUrls[0]),
    priority: 2,
    weight: 1,
    stallTimeout: 500
  },
  {
    provider: new ethers.providers.StaticJsonRpcProvider(`${PRIVATENODE}/ext/bc/C/rpc`),
    priority: 1,
    weight: 2,
    stallTimeout: 500
  },
];

const provider = new ethers.providers.FallbackProvider(providers,1);

const walletlink = new WalletLinkConnector({
  url: AVALANCHE_MAINNET_PARAMS.rpcUrls[0],
  appName: 'Snowball',
  appLogoUrl: 'https://raw.githubusercontent.com/Snowball-Finance/app-v2/master/public/assets/images/logo.png'
})

const injected = new InjectedConnector({ supportedChainIds: [Number(AVALANCHE_MAINNET_PARAMS.chainId)] })
const trustWallet = new InjectedConnector({ supportedChainIds: [Number(AVALANCHE_MAINNET_PARAMS.chainId)] })

export {
  injected,
  trustWallet,
  walletlink,
  AVALANCHE_MAINNET_PARAMS,
  PRIVATENODE,
  provider
}