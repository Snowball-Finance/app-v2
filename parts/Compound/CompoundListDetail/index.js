import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import ApyCalculation from './ApyCalculation';
import SnobAbyCalculation from './SnobAbyCalculation';
import Total from './Total';
import CompoundDialogs from '../CompoundDialogs';
import getProperAction from 'utils/helpers/getProperAction';
import CompoundActionButton from '../CompoundActionButton';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderTop: '1px solid rgba(110, 107, 123, 0.24)',
    paddingTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dialogTitle: {
    background: 'none',
    justifyContent: 'left',
  },
  dialogTitleText: {
    color: 'currentColor',
    textTransform: 'none',
  },
  dialogCloseIcon: {
    color: 'currentColor',
  },
}));

const CompoundListDetail = ({ item, userBoost, totalAPY }) => {
  const classes = useStyles();
  const [modal, setModal] = useState({ open: false, title: '' });

  const { withdraw, claim } = useCompoundAndEarnContract();

  const [ actionType, action ] = getProperAction(item, setModal, item.userLPBalance); 
  
  const handleClose = () => {
    setModal({ open: false, title: '' });
  };

  return (
    <div className={classes.root}>
      <div className={classes.details}>
        <ApyCalculation
          dailyAPR={item.dailyAPR}
          yearlyAPY={item.yearlyAPY}
          performanceFees={item.performanceFees}
        />
        <SnobAbyCalculation
          snobAPR={item.gaugeInfo.snobYearlyAPR}
          totalAPY={totalAPY}
          userBoost={userBoost}
        />
        <Total item={item} />
      </div>
      <div className={classes.button}>
        <CompoundActionButton type={actionType} action={action} endIcon={false} />
        <ContainedButton
          disabled={(item.userDepositedLP == 0)}
          onClick={() => {withdraw(item)}}
        >
          Withdraw
        </ContainedButton>
        <ContainedButton
          onClick={() => {claim(item)}}
          disabled={(item.SNOBHarvestable == 0)}
        >
          Claim
        </ContainedButton>
      </div>

      {modal.open && (
        <CompoundDialogs
          open={modal.open}
          title={modal.title}
          item={item}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default memo(CompoundListDetail);
