
import { memo, useState } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useNFTContract } from 'contexts/nft-context'
import ShopItem from './ShopItem'
import ShopDetailDialog from './ShopDetailDialog'
import { isEmpty } from 'utils/helpers/utility'

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
  },
  header: {
    marginBottom: theme.spacing(3)
  },
}));

const ShopNFTs = () => {
  const classes = useStyles();
  const { shopNFTs } = useNFTContract();

  const [item, setItem] = useState({})
  const [open, setOpen] = useState(false);

  const detailHandler = (item) => {
    setItem(item);
    setOpen(true);
  }

  return (
    <>
      <Grid container spacing={2} className={classes.container}>
        {isEmpty(shopNFTs)
          ? (
            <Grid item xs={12}>
              <Typography variant='h6' align='center'>
                No NFT
              </Typography>
            </Grid>
          )
          : shopNFTs.map((nft, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <ShopItem
                nft={nft}
                onDetail={detailHandler}
              />
            </Grid>
          ))
        }
      </Grid>
      {open &&
        <ShopDetailDialog
          open={open}
          setOpen={setOpen}
          item={item}
        />
      }
    </>
  )
}

export default memo(ShopNFTs)