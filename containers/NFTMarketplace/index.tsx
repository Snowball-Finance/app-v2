
import { memo, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { useNFTContract } from 'contexts/nft-context'
import PageHeader from 'parts/PageHeader'
import SubMenuTabs from 'parts/SubMenuTabs'
import SnowLoading from 'components/SnowLoading'
import ShopNFTs from './ShopNFTs'
import ClaimNFTs from './ClaimNFTs'
import CollectionNFTs from './CollectionNFTs'
import { NFT_TABS, NFT_TABS_ARRAY } from 'utils/constants/nft-tabs'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing(3)
  },
}));

const NFTMarketplace = (): JSX.Element => {
  const classes = useStyles();
  const { loading } = useNFTContract();

  const [selectedTab, setSelectedTab] = useState(NFT_TABS.shop.VALUE)

  const collectionHandler = () => {
    setSelectedTab(NFT_TABS.collection.VALUE)
  }

  return (
    <main className={classes.root}>
      {loading && <SnowLoading loading={loading} />}
      <PageHeader
        title='NFT Shop'
        subHeader='Purchase or Claim Snowball NFTs'
        className={classes.header}
      />
      <SubMenuTabs
        tabs={NFT_TABS_ARRAY}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {selectedTab === NFT_TABS.shop.VALUE && <ShopNFTs />}
      {selectedTab === NFT_TABS.claim.VALUE && <ClaimNFTs onCollect={collectionHandler} />}
      {selectedTab === NFT_TABS.collection.VALUE && <CollectionNFTs />}
    </main>
  )
}

export default memo(NFTMarketplace)