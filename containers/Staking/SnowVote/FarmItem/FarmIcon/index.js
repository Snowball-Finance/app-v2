import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { usePoolContract } from 'contexts/pool-context'
import LP_ICONS from 'utils/constants/lp-icons'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    marginRight: theme.spacing(2),
    height: 60,
  },
  mainImage: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    objectFit: 'container',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  subImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: '50%',
    objectFit: 'container',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
}));

const FarmIcon = ({
  token
}) => {
  const classes = useStyles();
  const { getGaugeInfo } = usePoolContract();
  const { token0 = {}, token1 = {} } = useMemo(() => getGaugeInfo(token), [token, getGaugeInfo]);

  return (
    <div className={classes.root}>
      <img
        alt='lp-icon'
        src={LP_ICONS[token0?.symbol || 'NoIcon']}
        className={classes.mainImage}
      />
      {LP_ICONS[token1?.symbol || 'NoIcon'] &&
        <img
          alt='token-icon'
          src={LP_ICONS[token1?.symbol || 'NoIcon']}
          className={classes.subImage}
        />
      }
    </div>
  )
}

export default memo(FarmIcon)
