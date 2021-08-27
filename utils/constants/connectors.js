
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { AVALANCHE_MAINNET_PARAMS } from 'utils/helpers/utility'

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
  walletlink
}