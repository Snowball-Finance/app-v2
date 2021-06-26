import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { COMPOUND_AND_EARN_IMAGE_PATH } from 'utils/constants/image-paths';
import CompoundHeader from 'parts/Compound/CompoundHeader';
import SearchInput from 'components/UI/SearchInput';
import Selects from 'components/UI/Selects';
import ListView from './ListView';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    width: '80%',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  filter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  search: {
    width: '60%'
  },
  selectBox: {
    width: '15%'
  },
}));

const CompoundAndEarn = () => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [selectType, setType] = useState('apy');
  const [selectPool, setPool] = useState('all');

  return (
    <main className={classes.root}>
      <CompoundHeader
        title="Compound and Earn SNOB now!"
        subHeader="Check your Investment"
        icon={COMPOUND_AND_EARN_IMAGE_PATH}
      />
      <div className={classes.container}>
        <div className={classes.filter}>
          <SearchInput
            className={classes.search}
            value={search}
            placeholder="Search your favorites pairs"
            onChange={(newValue) => setSearch(newValue)}
            onCancelSearch={() => setSearch('')}
            onRequestSearch={() => {
              console.log('searchData', search);
            }}
          />
          <Selects
            className={classes.selectBox}
            value={selectType}
            options={TYPES}
            onChange={(e) => {
              setType(e.target.value);
            }}
          />
          <Selects
            className={classes.selectBox}
            value={selectPool}
            options={POOLS}
            onChange={(e) => {
              setPool(e.target.value);
            }}
          />
        </div>

        <Typography variant="h5" className={classes.title}>
          PAIRS
        </Typography>

        <ListView />
      </div>
    </main>
  );
};

export default memo(CompoundAndEarn);

const TYPES = [
  {
    value: 'apy',
    label: 'APY',
  },
  {
    value: 'tvl',
    label: 'TVL',
  },
];

const POOLS = [
  {
    value: 'all',
    label: 'All pools',
  },
  {
    value: 'joined',
    label: 'Only joined',
  },
];
