import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'
import clsx from 'clsx'

import {
  COMPOUND_AND_EARN_IMAGE_PATH,
  COMPOUND_AND_EARN_BACKGROUND_IMAGE_PATH
} from 'utils/constants/image-paths'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    height: 100,
    backgroundImage: `url(${COMPOUND_AND_EARN_BACKGROUND_IMAGE_PATH})`,
    backgroundSize: 'cover',
  },
  icon: {
    position: 'absolute',
    right: 40,
    bottom: 0,
    objectFit: 'contain',
    height: 100,
  },
  container: {
    marginLeft: theme.spacing(4),
  },
  header: {
    fontWeight: 'bold',
    color: theme.custom.palette.white,
    marginBottom: theme.spacing(1),
  },
  subHeader: {
    fontSize: 12,
    color: theme.custom.palette.white,
    textTransform: 'none',
  }
}))

const StakingHeader = ({ className }) => {
  const classes = useStyles()

  return (
    <Card className={clsx(classes.root, className)}>
      <img alt="icon" src={COMPOUND_AND_EARN_IMAGE_PATH} className={classes.icon} />
      <div className={classes.container}>
        <Typography variant="h5" className={classes.header}>
          Staking
        </Typography>
        <Typography className={classes.subHeader} >
          Stake your SNOB and earn xSnob to vote in Governance
        </Typography>
      </div>
    </Card>
  )
}

export default memo(StakingHeader)
