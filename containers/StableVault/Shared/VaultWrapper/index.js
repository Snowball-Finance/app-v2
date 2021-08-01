import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'
import clsx from 'clsx'

import SnowLoading from 'components/SnowLoading'
import getVaultInfo from 'utils/helpers/getVaultInfo'
import { VAULT_ELLIPSE_IMAGE_PATH } from 'utils/constants/image-paths'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: -theme.spacing(4),
  },
  header: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 200,
    marginBottom: theme.spacing(3)
  },
  s3D: {
    background: theme.custom.gradient.blue,
  },
  s3F: {
    background: theme.custom.gradient.green,
  },
  s4D: {
    background: theme.custom.gradient.grey,
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
  title: {
    fontWeight: 'bold',
    color: theme.custom.palette.white,
    marginBottom: theme.spacing(2)
  },
  subTitle: {
    color: theme.custom.palette.white
  }
}));

const VaultWrapper = ({
  loading,
  pairNames,
  vault,
  children
}) => {
  const classes = useStyles();
  const vaultInfo = getVaultInfo(vault)

  return (
    <main className={classes.root}>
      {loading && <SnowLoading loading={loading} />}
      <Card className={clsx(classes.header, classes[vault])}>
        {(vaultInfo?.icon || '') &&
          <img
            alt='icon'
            src={vaultInfo.icon}
            className={classes.icon}
          />
        }
        <img
          alt='ellipse'
          src={VAULT_ELLIPSE_IMAGE_PATH}
          className={classes.ellipse}
        />
        <Typography
          variant='h4'
          className={classes.title}
        >
          {`${vault} Vault`}
        </Typography>
        <Typography
          variant='body2'
          align='center'
          className={classes.subTitle}
        >
          {pairNames}
        </Typography>
      </Card>
      {children}
    </main>
  );
}

export default memo(VaultWrapper)