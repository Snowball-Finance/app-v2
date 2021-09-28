
import { memo } from 'react'
import Image from 'next/image'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { formatNumber } from 'utils/helpers/format';

import LP_ICONS from 'utils/constants/lp-icons'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
    border: `1px solid ${theme.custom.palette.border}`,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  infoContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1)
    }
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: theme.spacing(1.5),
    borderRadius: '50%',
    overflow: 'hidden'
  },
  value: {
    fontWeight: 'bold',
  },
  removeLiquidity: {
    fontSize: 12,
    fontWeight: 400,
    textTransform: 'unset',
    borderRadius: 6
  },
}));

const StakeInformation = ({
  vault,
  staked,
  onRemove
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.infoContainer}>
        {LP_ICONS[vault.toUpperCase()] &&
          <div className={classes.icon}>
            <Image
              alt='icon'
              src={LP_ICONS[vault.toUpperCase()]}
              width={36}
              height={36}
              layout='fixed'
            />
          </div>
        }
        <Typography variant='body2' className={classes.value}>
          {`${formatNumber(staked, 2)} ${vault}`}
        </Typography>
      </div>
      <ContainedButton
        className={classes.removeLiquidity}
        disabled={staked === 0}
        onClick={onRemove}
      >
        Remove Liquidity
      </ContainedButton>
    </div>
  )
}

export default memo(StakeInformation)