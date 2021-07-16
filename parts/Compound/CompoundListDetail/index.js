import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import SuccessDialog from 'components/SuccessDialog';
import ApyCalculation from './ApyCalculation';
import SnobAbyCalculation from './SnobAbyCalculation';
import Total from './Total';
import CompoundDialogs from '../CompundDialogs';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context'

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

const CompoundListDetail = ({ item }) => {
  const classes = useStyles();
  const [modal, setModal] = useState({ open: false, title: '' });
  const [successModal, setSuccessModal] = useState(false);

  const { approve, submit } = useCompoundAndEarnContract();

  const handleClose = () => {
    setModal({ open: false, title: '' });
  };

  const onSubmit = (method, pairsName, amount) => {
    submit(method, pairsName, amount);
    handleClose();
    setSuccessModal(true);
  };
  
  const onApprove = (pairsName, amount) => {
    approve(pairsName, amount);
  }

  return (
    <div className={classes.root}>
      <div className={classes.details}>
        <ApyCalculation
          dailyAPY={item.dailyAPY}
          weeklyAPY={item.weeklyAPY}
          yearlyAPY={item.yearlyAPY}
          totalAPY={item.gaugeInfo.fullYearlyAPY}
        />
        <SnobAbyCalculation
          dailyAPY={item.gaugeInfo.snobDailyAPR}
          weeklyAPY={item.gaugeInfo.snobWeeklyAPR}
          yearlyAPY={item.gaugeInfo.snobYearlyAPR}
          performanceFees={item.performanceFees}
        />
        <Total />
      </div>
      <div className={classes.button}>
        <ContainedButton
          onClick={() => setModal({ open: true, title: 'Deposit' })}
        >
          Deposit
        </ContainedButton>
        <ContainedButton
          onClick={() => setModal({ open: true, title: 'Withdraw' })}
        >
          Withdraw
        </ContainedButton>
        <ContainedButton
          onClick={() => setModal({ open: true, title: 'Claim' })}
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
          onApprove={onApprove}
          onSubmit={onSubmit}
        />
      )}

      {successModal && (
        <SuccessDialog
          open={successModal}
          subHeader="Transaction submitted"
          handleClose={() => setSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default memo(CompoundListDetail);
