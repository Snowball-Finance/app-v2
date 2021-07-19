import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import ContainedButton from 'components/UI/Buttons/ContainedButton'
import CircleLeftIcon from 'components/Icons/CircleLeftIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  detail: {
    backgroundColor: 'rgba(103, 166, 240, 0.12)',
    fontSize: 14,
    fontWeight: 600,
    color: theme.custom.palette.blue,
    textTransform: 'none',
  }
}))

const ProposalDetail = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <ContainedButton
        className={classes.detail}
        size='small'
        disableElevation
        endIcon={<CircleLeftIcon />}
      >
        Detail
      </ContainedButton>
    </div>
  )
}

export default memo(ProposalDetail)
