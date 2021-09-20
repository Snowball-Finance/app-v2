import { memo } from 'react'
import Image from 'next/image'
import { Typography, Card, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import ListItem from 'parts/Card/ListItem'
import { NO_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
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
    position: 'relative',
    height: 186,
    minHeight: 186,
    width: '100%',
    objectFit: 'contain'
  },
  title: {
    fontWeight: 'bold',
  }
}));

const CollectionItem = ({
  nft
}) => {
  const classes = useStyles();
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
        </Grid>
      </Grid>
    </Card>
  );
}

export default memo(CollectionItem)