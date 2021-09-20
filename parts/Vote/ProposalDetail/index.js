import { memo } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'

import ContainedButton from 'components/UI/Buttons/ContainedButton'
import CircleLeftIcon from 'components/Icons/CircleLeftIcon'
import LINKS from 'utils/constants/links'

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

const ProposalDetail = ({
  proposalId
}) => {
  const classes = useStyles()
  const router = useRouter()

  const detailHandler = () => {
    router.push(
      LINKS.VOTE_DETAIL.HREF,
      LINKS.VOTE_DETAIL.HREF.replace('[proposal]', proposalId)
    )
  }

  return (
    <div className={classes.root}>
      <ContainedButton
        className={classes.detail}
        size='small'
        disableElevation
        endIcon={<CircleLeftIcon />}
        onClick={detailHandler}
      >
        Details
      </ContainedButton>
    </div>
  )
}

export default memo(ProposalDetail)
