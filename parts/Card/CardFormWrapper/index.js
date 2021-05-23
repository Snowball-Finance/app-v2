
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 2.5, 3.5),
    width: '100%',
    maxWidth: theme.custom.layout.maxCardWidth
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing(2.5)
  }
}));

const CardFormWrapper = ({
  title,
  className,
  children
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)}>
      <Typography className={classes.title}>
        {title}
      </Typography>
      {children}
    </Card>
  )
}

export default memo(CardFormWrapper)