
import NFTMarketplace from 'containers/NFTMarketplace'
import { NFTContractProvider } from 'contexts/nft-context'

export default function NFTMarketplacePage(): JSX.Element {
  return (
    <NFTContractProvider>
      <NFTMarketplace />
    </NFTContractProvider>
  )
}