
import { memo, useCallback } from 'react'
import {
  Grid,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import SnowDialog from 'components/SnowDialog'
import ListItem from 'parts/Card/ListItem'
import { isEmpty } from 'utils/helpers/utility'

const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: 420
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  container: {
    borderRadius: theme.spacing(1),
    margin: theme.spacing(1),
    padding: theme.spacing(1, 2),
    border: `1px solid ${theme.custom.palette.blue}`
  },
  item: {
    padding: theme.spacing(0, 1)
  }
}));

const ShopDetailDialog = ({
  item,
  open,
  setOpen
}) => {
  const classes = useStyles();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <SnowDialog
      open={open}
      title='Details'
      onClose={handleClose}
      dialogClass={classes.dialog}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography className={classes.title}>
            {item.title}
          </Typography>
          <Typography variant='body2'>
            {item.description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ListItem
            title='Minted'
            value={`${item.supply || 0} / ${item.max || 0}`}
          />
          <ListItem
            title='Artist'
            value={item.artist || 'No Name'}
          />
          <ListItem
            title='Owned'
            value={item.name}
          />
          <ListItem
            title='Type'
            value={item.type}
          />
          <ListItem
            title='Mint Type'
            value={item.category}
          />
        </Grid>
        {!isEmpty(item.bondCurve) &&
          <Grid item xs={12}>
            <div className={classes.container}>
              <Grid container>
                {item.bondCurve.map((item, index) => (
                  <Grid key={index} item xs={6}>
                    <ListItem
                      title={item[0]}
                      value={`${item[1]} AVAX`}
                      classes={{ root: classes.item }}
                    />
                  </Grid>
                ))}
              </Grid>
            </div>
          </Grid>
        }
      </Grid>
    </SnowDialog>
  );
}

export default memo(ShopDetailDialog)