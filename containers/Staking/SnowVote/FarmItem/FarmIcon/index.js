import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import GAUGE_INFO from 'utils/constants/gauge-info'
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

  const { a, b } = GAUGE_INFO[token];

  return (
    <div className={classes.root}>
      <img
        alt='lp-icon'
        src={LP_ICONS[a.priceId]}
        className={classes.mainImage}
      />
      {LP_ICONS[b.priceId] &&
        <img
          alt='token-icon'
          src={LP_ICONS[b.priceId]}
          className={classes.subImage}
        />
      }
    </div>
  )
}

export default memo(FarmIcon)
