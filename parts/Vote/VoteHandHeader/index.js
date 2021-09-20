import { memo } from 'react'
import Image from 'next/image'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'

import { VOTE_HAND_IMAGE_PATH } from 'utils/constants/image-paths'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
    height: '100%',
    padding: theme.spacing(1.5, 2.5),
    backgroundColor: theme.custom.palette.lightBlue
  },
  icon: {
    position: 'absolute',
    right: 40,
    objectFit: 'contain',
    height: '100%'
  },
  subHeader: {
    fontSize: 11,
    maxWidth: 370,
    marginBottom: theme.spacing(4)
  },
  subHeaderButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: 600,
    color: theme.custom.palette.blue,
    textTransform: 'none',
  }
}))

const VoteHandHeader = () => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <div className={classes.icon}>
        <Image
          alt='icon'
          src={VOTE_HAND_IMAGE_PATH}
          width={164}
          height={100}
          layout='fixed'
        />      
      </div>
      <Typography variant='body2' gutterBottom>
        Active proposals
      </Typography>
      <Typography className={classes.subHeader} >
        To vote, members must stake their SNOB for xSNOB.
        Read about proposal details in the Snowball Discord
      </Typography>
      <ContainedButton
        className={classes.subHeaderButton}
        size='small'
        disableElevation
        endIcon={<HelpOutlineIcon />}
      >
        More info
      </ContainedButton>
    </Card>
  )
}

export default memo(VoteHandHeader)
