
import { memo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { NFTS_LIST } from 'api/nft-marketplace/queries'
import PageHeader from 'parts/PageHeader'
import SearchInput from 'components/UI/SearchInput'
import Selects from 'components/UI/Selects'
import NFTItem from './NFTItem'
import NFTDetailDialog from './NFTDetailDialog'
import { NFT_TYPES, NFT_TYPES_ARRAY } from 'utils/constants/nft-types'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: theme.custom.layout.maxDesktopWidth,
    margin: theme.spacing(2, 0)
  }
}));

const NFTMarketplace = () => {
  const classes = useStyles();
  const { data: { NFTsList: nftsList = [] } = {} } = useQuery(NFTS_LIST);

  console.log(nftsList)
  const [query, setQuery] = useState('');
  const [type, setType] = useState(NFT_TYPES.price.value);
  const [item, setItem] = useState({})
  const [open, setOpen] = useState(false);

  const purchaseHandler = (item) => {
    console.log(item)
  }

  const detailHandler = (item) => {
    setItem(item);
    setOpen(true);
  }

  return (
    <main className={classes.root}>
      <PageHeader
        title='NFT Shop'
        subHeader='Check your Collection'
      />
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} sm={8} lg={9}>
          <SearchInput
            value={query}
            placeholder='Search your favorites NFTs'
            onChange={(value) => setQuery(value)}
            onCancelSearch={() => setQuery('')}
          />
        </Grid>
        <Grid item xs={12} sm={4} lg={3}>
          <Selects
            value={type}
            options={NFT_TYPES_ARRAY}
            onChange={(e) => setType(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {nftsList.map((nft, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <NFTItem
                  nft={nft}
                  onPurchase={purchaseHandler}
                  onDetail={detailHandler}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      {open &&
        <NFTDetailDialog
          open={open}
          setOpen={setOpen}
          item={item}
        />
      }
    </main>
  )
}

export default memo(NFTMarketplace)