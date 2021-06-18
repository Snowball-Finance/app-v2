import { memo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { COMPOUND_AND_EARN_IMAGE_PATH } from 'utils/constants/image-paths';
import CompoundHeader from 'parts/Compound/CompoundHeader';
import SearchInput from 'components/UI/SearchInput';
import GridListView from 'components/GridListView';
import Selects from 'components/UI/Selects';
import ListView from './ListView';
import GridView from './GridView';

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
    flexGrow: 6,
    marginRight: theme.spacing(2),
  },
  gridListView: {
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  selectBox: {
    flexGrow: 3,
  },
}));

const CompoundAndEarn = () => {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [listView, setListView] = useState(true);
  const [selectValue, setSelectValue] = useState('apy');

  const renderView = () => (listView ? <ListView /> : <GridView />);

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
          <GridListView
            className={classes.gridListView}
            isListView={listView}
            onChange={setListView}
          />
          <Selects
            className={classes.selectBox}
            value={selectValue}
            options={SELECT_OPTIONS}
            onChange={(e) => {
              setSelectValue(e.target.value);
            }}
          />
        </div>

        <Typography variant="h5" className={classes.title}>
          PAIRS
        </Typography>

        {renderView()}
      </div>
    </main>
  );
};

export default memo(CompoundAndEarn);

const SELECT_OPTIONS = [
  {
    value: 'apy',
    label: 'APY',
  },
  {
    value: 'tvl',
    label: 'TVL',
  },
];
