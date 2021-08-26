import { memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import SystemUpdateAltRoundedIcon from '@material-ui/icons/SystemUpdateAltRounded';
import clsx from 'clsx';

import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: 'none',
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  Details: {
    backgroundColor: theme.palette.primary
  },
  Deposit: {
    backgroundColor: theme.custom.palette.green
  },
  Get_PGL: {
    backgroundColor: theme.custom.palette.png_orange
  },
  Get_JLP: {
    backgroundColor: theme.custom.palette.joe_red
  },
  Get_xJoe: {
    backgroundColor: theme.custom.palette.joe_red
  },
  Get_s3D: {
    backgroundColor: theme.custom.palette.s3d_blue
  },
  Get_s3F: {
    backgroundColor: theme.custom.palette.s3f_green
  }
}));

const getIcon = (type) => {
  switch (type) {
    case 'Details':
      return <ArrowDropDownCircleIcon />
    case 'Deposit':
      return <SystemUpdateAltRoundedIcon />
    case 'Get_PGL':
    case 'Get_JLP':
    case 'Get_xJoe':
    case 'Get_s3D':
    case 'Get_s3F':
    case 'Get_s4D':
    case 'Get_Token':
      return <LaunchIcon />
    default:
      return null
  }
}

const CompoundActionButton = ({
  type,
  action,
  endIcon = true,
  disabled,
  fullWidth
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { setTransactionStatus } = useCompoundAndEarnContract();

  const buttonHandler = useCallback(() => {
    action(router);
    if (type === 'Deposit') {
      setTransactionStatus({ approvalStep: 0, depositStep: 0 });
    }
  }, [type, action, router, setTransactionStatus])

  return (
    <ContainedButton
      className={clsx({ [classes.button]: endIcon }, classes[type])}
      size={endIcon ? 'small' : 'medium'}
      disableElevation={endIcon}
      endIcon={getIcon(type)}
      onClick={buttonHandler}
      disabled={disabled}
      fullWidth={fullWidth}
    >
      {type.replace('_', ' ')}
    </ContainedButton>
  );
};

export default memo(CompoundActionButton);
