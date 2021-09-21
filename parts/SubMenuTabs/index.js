
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Card } from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5, 1),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    }
  },
  button: {
    fontSize: 16,
    fontWeight: 500,
    textTransform: 'capitalize',
    padding: theme.spacing(0.5, 1),
    borderRadius: 7,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      minWidth: 'unset',
      padding: theme.spacing(0.5),
    }
  },
  selected: {
    backgroundColor: theme.custom.palette.lightBlue
  }
}));

const SubMenuTabs = ({
  tabs,
  selectedTab,
  setSelectedTab,
  className
}) => {
  const classes = useStyles();

  const buttonHandler = (value) => () => {
    setSelectedTab(value)
  }

  return (
    <Card className={clsx(classes.root, className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.VALUE}
          className={clsx(classes.button, { [classes.selected]: tab.VALUE === selectedTab })}
          onClick={buttonHandler(tab.VALUE)}
        >
          {tab.LABEL}
        </Button>
      ))}
    </Card>
  )
}

export default memo(SubMenuTabs)