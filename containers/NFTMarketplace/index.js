
import { memo, useState } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
            {NFT_LIST.map((nft, index) => (
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

const NFT_LIST = [
  {
    title: 'Snow Ball Head',
    description: 'Mighty Ice Warrior from Snowball',
    image: 'https://images.unsplash.com/photo-1499715008769-aa2cf0aaad5b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODN8fHNub3diYWxsfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    price: 5,
    minted: 140,
    totalMint: 150,
    owned: 0,
    artist: 'Fennec',
    type: 'ERC-721'
  },
  {
    title: 'Snow Ball Head',
    description: 'Mighty Ice Warrior from Snowball',
    image: 'https://images.unsplash.com/photo-1625793741148-5f83903e617c?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    price: 5,
    minted: 140,
    totalMint: 150,
    owned: 0,
    artist: 'Fennec',
    type: 'ERC-721'
  },
  {
    title: 'Snow Ball Head',
    description: 'Mighty Ice Warrior from Snowball',
    image: 'https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fGNhcnRvb258ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    price: 5,
    minted: 140,
    totalMint: 150,
    owned: 0,
    artist: 'Fennec',
    type: 'ERC-721'
  },
  {
    title: 'Snow Ball Head',
    description: 'Mighty Ice Warrior from Snowball',
    image: 'https://images.unsplash.com/photo-1499715008769-aa2cf0aaad5b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODN8fHNub3diYWxsfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    price: 5,
    minted: 140,
    totalMint: 150,
    owned: 0,
    artist: 'Fennec',
    type: 'ERC-721'
  }
]