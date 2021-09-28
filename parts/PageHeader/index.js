import { memo } from 'react'
import Image from 'next/image'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import clsx from 'clsx'

import {
  COMPOUND_AND_EARN_IMAGE_PATH,
  COMPOUND_AND_EARN_BACKGROUND_IMAGE_PATH
} from 'utils/constants/image-paths'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

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
  subHeaderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    fontSize: 12,
    fontWeight: 600,
    color: theme.custom.palette.white,
    textTransform: 'none',
  },
  rightIcon: {
    backgroundColor: theme.custom.palette.blue,
    borderRadius: '50%',
  },
  subHeader: {
    fontSize: 12,
    color: theme.custom.palette.white,
    textTransform: 'none',
  }
}))

const PageHeader = ({
  title,
  subHeader,
  subButton,
  className
}) => {
  const classes = useStyles()

  return (
    <Card className={clsx(classes.root, className)}>
      <div className={classes.icon}>
        <Image alt="icon" src={COMPOUND_AND_EARN_IMAGE_PATH} width={164} height={100} layout='fixed' />
      </div>
      <div className={classes.container}>
        <Typography variant="h5" className={classes.header}>
          {title}
        </Typography>
        {subButton &&
          <ContainedButton
            className={classes.subHeaderButton}
            size="small"
            disableElevation
            endIcon={<ChevronRightIcon className={classes.rightIcon} />}
          >
            {subButton}
          </ContainedButton>
        }
        {subHeader &&
          <Typography className={classes.subHeader} >
            {subHeader}
          </Typography>
        }
      </div>
    </Card>
  )
}

export default memo(PageHeader)
