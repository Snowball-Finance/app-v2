import { memo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import SystemUpdateAltRoundedIcon from '@material-ui/icons/SystemUpdateAltRounded';
import clsx from 'clsx';

import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import { toast } from 'react-toastify';
import Toast from 'components/Toast';

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: 'none',
    '&:hover': {
      color: '#fff'
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  color: props => ({
    backgroundColor: theme.custom.palette.actions[props.type]
  }),
}));

const getIcon = (type) => {
  switch (type) {
    case "Details":
      return (<ArrowDropDownCircleIcon />);
    case "Deposit":
      return (<SystemUpdateAltRoundedIcon />);
    case "CLAIM":
      return;
    default:
      return (<LaunchIcon />);
  }
}

const CompoundActionButton = ({
  type,
  action,
  endIcon = true,
  disabled,
  fullWidth,
  setUserData,
  item
}) => {
  const classes = useStyles({type});
  const router = useRouter();
  const { setTransactionStatus, claim, getBalanceInfoSinglePool, isTransacting } = useCompoundAndEarnContract();

  const buttonHandler = useCallback(() => {
    if (type === 'CLAIM') {
      toast(<Toast message={'Claiming your Tokens...'} toastType={'processing'}/>)
      claim(item).then(()=>{
      getBalanceInfoSinglePool(item.address).then((userData) => 
        setUserData(userData))
      })
    }
    else {
      action(router);
      if (type === 'Deposit') {
        setTransactionStatus({ approvalStep: 0, depositStep: 0 });
      }
    }
  }, [type, action, router, setTransactionStatus])

  return (
    <ContainedButton
      className={clsx({ [classes.button]: endIcon }, classes.color)}
      size={endIcon ? 'small' : 'medium'}
      disableElevation={endIcon}
      endIcon={endIcon ? getIcon(type) : null}
      onClick={buttonHandler}
      disabled={disabled}
      fullWidth={fullWidth}
      loading={type === 'CLAIM' ? isTransacting.pageview : null}
    >
      {type.replace('_', ' ')}
    </ContainedButton>
  );
};

export default memo(CompoundActionButton);
