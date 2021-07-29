
import { memo } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useNFTContract } from 'contexts/nft-context'
import ClaimItem from './ClaimItem'
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

const ClaimNFTs = ({
  onCollect
}) => {
  const classes = useStyles();
  const { claimNFTs } = useNFTContract();

  return (
    <Grid container spacing={2} className={classes.container}>
      {isEmpty(claimNFTs)
        ? (
          <Grid item xs={12}>
            <Typography variant='h6' align='center'>
              No NFT
            </Typography>
          </Grid>
        )
        : claimNFTs.map((nft, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <ClaimItem
              nft={nft}
              onCollect={onCollect}
            />
          </Grid>
        ))
      }
    </Grid>
  )
}

export default memo(ClaimNFTs)