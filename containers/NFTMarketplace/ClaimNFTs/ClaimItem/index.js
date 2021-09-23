import { memo } from 'react'
import Image from 'next/image'
import { Typography, Card, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useNFTContract } from 'contexts/nft-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import ListItem from 'parts/Card/ListItem'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'
import NFT_STATUS from 'utils/constants/nft-status'

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    height: '100%',
    paddingBottom: theme.spacing(6),
    '&:hover': {
      transform: 'translateY(-5px)',
      transition: `ease-out 0.4s `,
      opacity: '100%'
    },
  },
  infoContainer: {
    padding: theme.spacing(2),
  },
  image: {
    position: 'relative',
    height: 186,
    minHeight: 186,
    width: '100%',
    objectFit: 'contain'
  },
  title: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  button: {
    borderRadius: 0,
    padding: theme.spacing(1.5)
  }
}));

const ClaimItem = ({
  nft,
  onCollect
}) => {
  const classes = useStyles();
  const { claimNFT } = useNFTContract();

  const purchaseHandler = () => {
    if (nft.status === NFT_STATUS.ELIGIBLE.VALUE) {
      claimNFT(nft)
    } else {
      onCollect()
    }
  }

  return (
    <Card className={classes.card}>
      <Grid container spacing={2} className={classes.infoContainer}>
        <Grid item xs={12}>
          <div className={classes.image}>
            <Image
              alt='NFT Image'
              src={nft?.imgUrl || NO_IMAGE_PATH}
              objectFit='contain'
              layout='fill'
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <ListItem
            title={nft.title}
            value={`${nft.baseCost || 0} AVAX`}
            classes={{
              title: classes.title
            }}
          />
          <Typography variant='body2'>
            {nft.description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ListItem
            title='Type'
            value={nft.type}
          />
          <ListItem
            title='Status'
            value={NFT_STATUS[nft.status].LABEL}
          />
        </Grid>
      </Grid>

      <div className={classes.buttonContainer}>
        <ContainedButton
          fullWidth
          disabled={nft.status === NFT_STATUS.NOT_DONATE.VALUE}
          className={classes.button}
          onClick={purchaseHandler}
        >
          {NFT_STATUS[nft.status].BUTTON}
        </ContainedButton>
      </div>
    </Card>
  );
}

export default memo(ClaimItem)