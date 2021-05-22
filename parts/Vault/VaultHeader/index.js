
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'
import clsx from 'clsx'

import { VAULT_ELLIPSE_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 200,
    background: `linear-gradient(90deg, ${theme.custom.palette.blue} 0%, ${theme.custom.palette.darkBlue} 100%)`
  },
  icon: {
    position: 'absolute',
    left: 4,
    bottom: 0,
    objectFit: 'contain',
    height: 130,
  },
  ellipse: {
    position: 'absolute',
    right: 0,
    objectFit: 'contain',
    height: '100%',
  },
  header: {
    fontWeight: 'bold',
    color: theme.custom.palette.white,
    marginBottom: theme.spacing(2)
  },
  subHeader: {
    color: theme.custom.palette.white
  }
}));

const VaultHeader = ({
  title,
  subHeader1,
  subHeader2,
  icon,
  className
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)}>
      <img
        alt='icon'
        src={icon}
        className={classes.icon}
      />
      <img
        alt='ellipse'
        src={VAULT_ELLIPSE_IMAGE_PATH}
        className={classes.ellipse}
      />
      <Typography variant='h4' className={classes.header}>
        {title}
      </Typography>
      <Typography variant='body2' align='center' className={classes.subHeader}>
        {subHeader1}
        <br />
        {subHeader2}
      </Typography>
    </Card>
  )
}

export default memo(VaultHeader)