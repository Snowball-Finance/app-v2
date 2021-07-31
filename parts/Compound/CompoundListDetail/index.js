import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import clsx from 'clsx';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import SuccessDialog from 'components/SuccessDialog';
import ApyCalculation from './ApyCalculation';
import SnobAbyCalculation from './SnobAbyCalculation';
import Total from './Total';
import CompoundDialogs from '../CompoundDialogs';
import GradientButton from 'components/UI/Buttons/GradientButton';
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
  modalButton: {
    padding: theme.spacing(2, 0),
    textTransform: 'none',
  },
  greyButton: {
    background: '#BDBDBD',
  },
}));

const CompoundListDetail = ({ item, userBoost, totalAPY }) => {
  const classes = useStyles();
  const [modal, setModal] = useState({ open: false, title: '' });
  const [successModal, setSuccessModal] = useState(false);

  const { approve, submit } = useCompoundAndEarnContract();

  const handleClose = () => {
    setModal({ open: false, title: '' });
  };

  const onSubmit = async (method, pairsName, amount) => {
    const showModal = await submit(method, pairsName, amount);
    if (showModal) {
      handleClose();
      setSuccessModal(true);
    }
  };

  const onApprove = (pairsName, amount) => {
    approve(pairsName, amount);
  };

  // TODO: Please manage the coditional rendring of buttons
  const renderButton = () => {
    switch (modal.title) {
      case 'Withdraw': {
        return (
          <Grid item xs={12}>
            <GradientButton
              className={clsx(classes.modalButton)}
              disableElevation
              fullWidth
              onClick={() => onSubmit(modal.title, item.name, amount)}
            >
              {modal.title}
            </GradientButton>
          </Grid>
        );
      }
      case 'Deposit': {
        return (
          <>
            <Grid item xs={6}>
              <ContainedButton
                className={clsx(classes.modalButton, classes.greyButton)}
                disableElevation
                fullWidth
                onClick={() => onApprove(item.name, amount)}
              >
                Approve
              </ContainedButton>
            </Grid>
            <Grid item xs={6}>
              <GradientButton
                className={clsx(classes.modalButton)}
                disableElevation
                fullWidth
                onClick={() => onSubmit(modal.title, item.name, amount)}
              >
                {modal.title}
              </GradientButton>
            </Grid>
          </>
        );
      }
      default:
        return null;
    }
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
          footerButton={renderButton}
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
