
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import CardWrapper from 'parts/Card/CardWrapper'

const useStyles = makeStyles(() => ({
  root: {}
}));

const SwapForm = () => {
  const classes = useStyles();

  return (
    <CardWrapper title='Swap' className={classes.root}>

    </CardWrapper>
  )
}

export default memo(SwapForm)