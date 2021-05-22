
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Card } from '@material-ui/core'
import clsx from 'clsx'

import { VAULT_TABS_ARRAY } from 'utils/constants/vault-tabs'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5, 1),
    marginBottom: theme.spacing(4)
  },
  button: {
    fontSize: 16,
    fontWeight: 500,
    textTransform: 'capitalize',
    padding: theme.spacing(0.5, 1),
    borderRadius: 7,
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

const VaultTabs = ({
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
      {VAULT_TABS_ARRAY.map((tab) => (
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

export default memo(VaultTabs)