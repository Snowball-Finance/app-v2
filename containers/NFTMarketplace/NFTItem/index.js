import { memo } from 'react'
import { Typography, Card, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import CartIcon from 'components/Icons/CartIcon'
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
            src={nft?.imgUrl || NO_IMAGE_PATH}
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12}>
          <ListItem
            title={nft.title}
            value={`${nft.baseCost || 0}AVAX`}
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
            value={`${nft.minted || 0} / ${nft.max || 0}`}
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