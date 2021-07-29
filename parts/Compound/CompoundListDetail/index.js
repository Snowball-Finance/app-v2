import { makeStyles } from '@material-ui/core/styles';
import SuccessDialog from 'components/SuccessDialog';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import { useCompoundAndEarnContract } from 'contexts/compound-and-earn-context';
import { memo, useState } from 'react';
import getProperAction from 'utils/helpers/getProperAction';
import CompoundActionButton from '../CompoundActionButton';
import CompoundDialogs from '../CompoundDialogs';
import ApyCalculation from './ApyCalculation';
import SnobAbyCalculation from './SnobAbyCalculation';
import Total from './Total';


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
  }
}));

const CompoundListDetail = ({ item, userBoost, totalAPY }) => {
  const classes = useStyles();
  const [modal, setModal] = useState({ open: false, title: '' });
  const [successModal, setSuccessModal] = useState(false);
  const [txReceipt, setTxReceipt] = useState();

  const { approve, submit, claim } = useCompoundAndEarnContract();
  const [ actionType, action ] = getProperAction(item, item.userLPBalance);

  const handleClose = () => {
    setModal({ open: false, title: '' });
  };

  const onSubmit = async(method, pairsName, amount) => {
    const showModal = await submit(method, pairsName, amount);
    if ( showModal ) {
      handleClose();
      setSuccessModal(true);
    }
  };

  const onClaim = async(item) => {
    const {claimTxReceipt, error} = await claim(item);
    if (error) {
      // Error Modal
      // Modal should be a context 
      return console.log(error)
    }
    setTxReceipt(claimTxReceipt);
    setSuccessModal(true);
  };
  
  const onApprove = (pairsName, amount) => {
    approve(pairsName, amount);
  }

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
        <Total 
          item={item}
        />
      </div>
      <div className={classes.button}>
        <CompoundActionButton type={actionType} action={action} endIcon={false} />
        <ContainedButton
          onClick={() => setModal({ open: true, title: 'Withdraw' })}
        >
          Withdraw
        </ContainedButton>
        <ContainedButton
          onClick={() => onClaim(item)}
          disabled={(item.SNOBHarvestable == 0) ? true : false}
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
          txReceipt={txReceipt}
          handleClose={() => {
            setSuccessModal(false)
            setTimeout(() => {
              window.location.reload();
            }, 5000)
          }}
        />
      )}
    </div>
  );
};

export default memo(CompoundListDetail);
