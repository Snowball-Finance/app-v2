import { memo } from 'react';
import { TableCell, TableRow } from '@material-ui/core';

import DashboardTokenPairsSkeleton from 'components/Skeletons/DashboardTokenPairs';

const TokenPairsSkeleton = () => {
  return [1, 2, 3, 4].map((item) => (
    <TableRow key={item}>
      <TableCell>
        <DashboardTokenPairsSkeleton />
      </TableCell>
    </TableRow>
  ));
};

export default memo(TokenPairsSkeleton);
