
import { memo } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useNFTContract } from 'contexts/nft-context'
import CollectionItem from './CollectionItem'
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

const CollectionNFTs = () => {
  const classes = useStyles();
  const { purchasedNFTs } = useNFTContract();

  return (
    <Grid container spacing={2} className={classes.container}>
      {isEmpty(purchasedNFTs)
        ? (
          <Grid item xs={12}>
            <Typography variant='h6' align='center'>
              No Collection
            </Typography>
          </Grid>
        )
        : purchasedNFTs.map((nft, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <CollectionItem nft={nft} />
          </Grid>
        ))
      }
    </Grid>
  )
}

export default memo(CollectionNFTs)