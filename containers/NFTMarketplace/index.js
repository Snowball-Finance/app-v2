
import { memo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useNFTContract } from 'contexts/nft-context'
import { NFTS_LIST } from 'api/nft-marketplace/queries'
import PageHeader from 'parts/PageHeader'
import SnowLoading from 'components/SnowLoading'
import NFTItem from './NFTItem'
import NFTDetailDialog from './NFTDetailDialog'

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
  const { loading } = useNFTContract();

  const { data: { NFTsList: nftsList = [] } = {} } = useQuery(NFTS_LIST);
  const [item, setItem] = useState({})
  const [open, setOpen] = useState(false);

  const detailHandler = (item) => {
    setItem(item);
    setOpen(true);
  }

  return (
    <main className={classes.root}>
      {loading && <SnowLoading loading={loading} />}
      <PageHeader
        title='NFT Shop'
        subHeader='Purchase or Claim Snowball NFTs'
      />
      <Grid container spacing={2} className={classes.container}>
        {nftsList.map((nft, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <NFTItem
              nft={nft}
              onDetail={detailHandler}
            />
          </Grid>
        ))}
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