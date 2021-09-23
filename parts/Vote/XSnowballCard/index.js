import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'

import CoinIcon from 'components/Icons/CoinIcon'
import { useContracts } from 'contexts/contract-context'
import { VOTE_POWER_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    padding: theme.spacing(2),
    backgroundImage: `url(${VOTE_POWER_BACKGROUND_IMAGE_PATH})`,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'right',
    backgroundPositionY: 'bottom',
    backgroundColor: theme.custom.palette.blue
  },
  icon: {
    marginRight: theme.spacing(2)
  },
  header: {
    color: theme.custom.palette.white
  },
  subHeader: {
    fontSize: 24,
    color: theme.custom.palette.white,
    marginBottom: theme.spacing(1)
  }
}))

const XSnowballCard = () => {
  const classes = useStyles()
  const { snowconeBalance } = useContracts()
  return (
    <Card className={classes.root}>
      <CoinIcon size={62} className={classes.icon} />
      <div>
        <Typography
          variant='body2'
          className={classes.header}
        >
          Voting power
        </Typography>
        <Typography className={classes.subHeader} >
          {snowconeBalance.toFixed(3)} xSNOB
        </Typography>
      </div>
    </Card>
  )
}

export default memo(XSnowballCard)
