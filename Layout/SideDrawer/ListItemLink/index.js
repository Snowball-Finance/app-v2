import { memo } from 'react';
import ListItem from '@material-ui/core/ListItem';

import ButtonLink from 'components/UI/Buttons/ButtonLink';

const ListItemLink = ({ children, ...rest }) => (
  <ListItem button component={ButtonLink} {...rest}>
    {children}
  </ListItem>
);

export default memo(ListItemLink);
