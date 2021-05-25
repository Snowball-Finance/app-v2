
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import LP_ICONS from 'utils/constants/lp-icons'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: theme.spacing(1.5)
  },
  label: {
    fontSize: 16,
    '& span': {
      fontSize: 22,
      fontWeight: 'bold',
      marginRight: theme.spacing(1)
    }
  },
  button: {
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'unset',
    borderRadius: 6,
  },
}));

const RemoveLiquidity = ({
  type,
  value,
  onRemove
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.infoContainer}>
        <img
          alt='token-icon'
          src={LP_ICONS[type]}
          className={classes.icon}
        />
        <Typography className={classes.label}>
          <span>
            {value}
          </span>
          {type}
        </Typography>
      </div>
      <ContainedButton
        className={classes.button}
        onClick={onRemove}
      >
        Remove Liquidity
      </ContainedButton>
    </div>
  )
}

export default memo(RemoveLiquidity)