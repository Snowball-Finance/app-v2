import { memo } from 'react'
import { Typography, Card, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CartIcon from 'components/Icons/CartIcon'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import ListItem from 'parts/Card/ListItem'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
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
    height: 186,
    width: '100%',
    objectFit: 'contain'
  },
  title: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 0,
    padding: theme.spacing(1.5)
  }
}));

const NFTItem = ({
  nft,
  onPurchase,
  onDetail
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Grid container spacing={2} className={classes.infoContainer}>
        <Grid item xs={12}>
          <img
            alt='carousel'
            src={nft?.image || NO_IMAGE_PATH}
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12}>
          <ListItem
            title={nft.title}
            value={`${nft.price} AVAX`}
            classes={{
              title: classes.title
            }}
          />
          <Typography variant='body2'>
            {nft.description}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <ListItem
            title='Minted'
            value={`${nft.minted} / ${nft.totalMint}`}
          />
          <ListItem
            title='Artist'
            value={nft.artist}
          />
        </Grid>
        <Grid item xs={6}>
          <ListItem
            title='Owned'
            value={nft.owned}
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
          className={classes.button}
          onClick={() => onDetail(nft)}
        >
          Detail
        </ContainedButton>
        <ContainedButton
          fullWidth
          startIcon={<CartIcon color='white' />}
          className={classes.button}
          onClick={onPurchase}
        >
          Buy
        </ContainedButton>
      </div>
    </Card>
  );
}

export default memo(NFTItem)