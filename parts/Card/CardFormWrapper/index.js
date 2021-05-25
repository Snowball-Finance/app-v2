
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 2.5, 3.5),
    width: '100%',
    height: '100%',
    maxWidth: theme.custom.layout.maxCardWidth
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: theme.spacing(0.5)
  }
}));

const CardFormWrapper = ({
  title,
  subTitle,
  icon,
  className,
  children
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)}>
      <div className={classes.header}>
        <div>
          {title && (
            <Typography className={classes.title}>
              {title}
            </Typography>
          )}
          {subTitle && (
            <Typography variant='body2'>
              {subTitle}
            </Typography>
          )}
        </div>
        {icon && icon}
      </div>
      {children}
    </Card>
  )
}

export default memo(CardFormWrapper)