import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CustomAccordion from 'components/CustomAccordion';
// import DepositItem from 'parts/Compound/CompoundListItem/DepositItem';
import DetailItem from 'parts/Compound/CompoundListItem/DetailItem';
import CompoundListDetail from 'parts/Compound/CompoundListDetail';

const useStyles = makeStyles((theme) => ({
  detailButton: {
    textTransform: 'none',
    backgroundColor: theme.custom.palette.lightBlue,
    color: theme.custom.palette.blue,
  },
}));

const ListView = ({ poolsInfo }) => {
  const classes = useStyles();
  console.log("=poolsInfo==",poolsInfo);
  const detailButton = () => (
    <ContainedButton
      className={classes.detailButton}
      size="small"
      disableElevation
      endIcon={<ArrowDropDownCircleIcon />}
    >
      Details
    </ContainedButton>
  );

  return poolsInfo?.map((item) => {
    return (
      <CustomAccordion
        key={item.address}
        expandMoreIcon={detailButton()}
        summary={<DetailItem item={item}/>}
        details={<CompoundListDetail item={item}/>}
      />
    );

    // return <DepositItem key={item.id} />;
  });
};

export default memo(ListView);