import { memo, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { usePoolContract } from 'contexts/pool-context'

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
        alt='token-icon'
        src={`https://raw.githubusercontent.com/Snowball-Finance/bridge-tokens/main/avalanche-tokens/${token0.address}/logo.png`}
        className={classes.mainImage}
      />
      {token1.address &&
        <img
          alt='token-icon'
          src={`https://raw.githubusercontent.com/Snowball-Finance/bridge-tokens/main/avalanche-tokens/${token1.address}/logo.png`}
          className={classes.subImage}
        />
      }
    </div>
  )
}

export default memo(FarmIcon)
