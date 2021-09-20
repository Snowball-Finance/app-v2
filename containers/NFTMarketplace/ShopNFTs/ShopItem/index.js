import { memo } from 'react'
import Image from 'next/image'
import { Typography, Card, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useNFTContract } from 'contexts/nft-context'
import { ShoppingCart } from 'react-feather';
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import ListItem from 'parts/Card/ListItem'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'

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
  detailButton: {
    backgroundColor: theme.custom.palette.lightGrey,
    color: theme.custom.palette.darkGrey,
    borderRadius: 0,
    padding: theme.spacing(1.5)
  },
  button: {
    borderRadius: 0,
    padding: theme.spacing(1.5)
  }
}));

const ShopItem = ({
  nft,
  onDetail
}) => {
  const classes = useStyles();
  const { purchaseNFT } = useNFTContract();

  const purchaseHandler = () => {
    purchaseNFT(nft)
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
            title='Minted'
            value={`${nft.supply || 0} / ${nft.max || 0}`}
          />
          <ListItem
            title='Artist'
            value={nft.artist || 'No Name'}
          />
          <ListItem
            title='Owned'
            value={nft.name}
          />
          <ListItem
            title='Type'
            value={nft.type}
          />
        </Grid>
      </Grid>

      <div className={classes.buttonContainer}>
        <ContainedButton
          fullWidth
          color='secondary'
          className={classes.detailButton}
          onClick={() => onDetail(nft)}
        >
          Detail
        </ContainedButton>
        <ContainedButton
          fullWidth
          disabled={nft.max === nft.supply}
          startIcon={<ShoppingCart size={18} color='white' />}
          className={classes.button}
          onClick={purchaseHandler}
        >
          {nft.max === nft.supply ? 'Max Mint' : 'Buy'}
        </ContainedButton>
      </div>
    </Card>
  );
}

export default memo(ShopItem)