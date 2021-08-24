
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Paper } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.primary,
    cursor: 'pointer',
    transition: 'ease-out 0.4s',
    borderRadius: theme.spacing(1.5),
    '&:hover': {
      transform: 'translateY(-5px)',
    }
  },
  selected: {
    border: `1px solid ${theme.custom.palette.border}`
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
    margin: theme.spacing(1)
  }
}));

const WalletCard = ({
  name,
  selected
}) => {
  const classes = useStyles()

  return (
    <Paper className={clsx(classes.paper, { [classes.selected]: selected })}>
      <img
        className={classes.icon}
        src={`/assets/images/wallet/${name}.png`}
        alt='Logo'
      />
      <Typography
        variant='h6'
        color='textSecondary'
        className={classes.label}
      >
        {name}
      </Typography>
    </Paper>
  );
}

export default memo(WalletCard);