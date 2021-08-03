import { memo } from 'react';
import { Typography } from '@material-ui/core';

import ListItem from '../ListItem'
import { isEmpty } from 'utils/helpers/utility';

const ListView = ({
  poolsInfo
}) => {
  return (
    <>
      {isEmpty(poolsInfo)
        ? (
          <Typography variant='h6' align='center'>
            No Pairs
          </Typography>
        )
        : poolsInfo?.map((pool, index) => (
          <ListItem key={index} pool={pool} />
        ))
      }
    </>
  )
};

export default memo(ListView);