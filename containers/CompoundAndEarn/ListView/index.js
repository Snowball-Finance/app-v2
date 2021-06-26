import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';

import ContainedButton from 'components/UI/Buttons/ContainedButton';
import CustomAccordion from 'components/CustomAccordion';
import DepositItem from 'parts/Compound/CompoundListItem/DepositItem';
import DetailItem from 'parts/Compound/CompoundListItem/DetailItem';
import CompoundListDetail from 'parts/Compound/CompoundListDetail';

const useStyles = makeStyles((theme) => ({
  detailButton: {
    textTransform: 'none',
    backgroundColor: theme.custom.palette.lightBlue,
    color: theme.custom.palette.blue
  },
}));

const ListView = () => {
  const classes = useStyles();

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

  return demoListViewItems.map((item) => {
    if (item.isDetail) {
      return (
        <CustomAccordion
          key={item.id}
          expandMoreIcon={detailButton()}
          summary={<DetailItem />}
          details={<CompoundListDetail />}
        />
      );
    }

    return <DepositItem key={item.id} />;
  });
};

export default memo(ListView);

const demoListViewItems = [
  {
    id: 1,
    name: 'First',
    isDetail: false,
  },
  {
    id: 2,
    name: 'Second',
    isDetail: true,
  },
  {
    id: 3,
    name: 'three',
    isDetail: true,
  },
  {
    id: 4,
    name: 'four',
    isDetail: false,
  },
  {
    id: 5,
    name: 'five',
    isDetail: false,
  },
];
