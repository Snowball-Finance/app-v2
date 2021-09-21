import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.primary,
    cursor: 'pointer',
    transition: 'ease-out 0.4s',
    border: '1px solid rgba(117, 115, 115, 0.2)',
    borderRadius: theme.spacing(1.5),
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  selected: {
    border: `1px solid ${theme.custom.palette.border}`,
  },
  icon: {
    width: 40,
    height: 40,
    [theme.breakpoints.down('sm')]: {
      width: 28,
      height: 28,
    },
  },
  label: {
    fontWeight: 'bold',
    textAlign: 'center',
    margin: theme.spacing(1),
  },
}));

const WalletCard = ({ name, selected }) => {
  const classes = useStyles();

  return (
    <Grid
      container
      className={clsx(classes.container, { [classes.selected]: selected })}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Grid item>
        <img
          className={classes.icon}
          src={`/assets/images/wallet/${name}.png`}
          alt="Logo"
        />
      </Grid>

      <Grid item>
        <Typography variant="body2" className={classes.label}>
          {name}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default memo(WalletCard);
