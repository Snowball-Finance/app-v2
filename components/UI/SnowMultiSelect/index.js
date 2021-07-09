
import React, { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Select,
  MenuItem,
  Chip
} from '@material-ui/core'

import SnowTextField from 'components/UI/TextFields/SnowTextField'

const useStyles = makeStyles(theme => ({
  menuPaper: {
    backgroundColor: theme.palette.background.primary
  },
  icon: {
    borderRadius: 2,
    marginRight: theme.spacing(1),
    color: theme.palette.text.primary
  },
  placeholder: {
    color: theme.palette.text.primary,
  },
  item: {
    color: theme.palette.text.primary,
  },
  selected: {
    backgroundColor: `${theme.palette.primary.light} !important`
  },
  chip: {
    borderRadius: 2,
    height: 24,
    marginRight: theme.spacing(1),
    color: theme.custom.palette.white,
    backgroundColor: theme.palette.primary.light
  }
}));

const SnowMultiSelect = React.forwardRef(({
  items = [],
  label,
  ...rest
}, ref) => {

  const classes = useStyles();

  return (
    <Select
      labelId='demo-mutiple-name-label'
      id='demo-mutiple-name'
      multiple
      ref={ref}
      input={<SnowTextField label={label} />}
      displayEmpty
      classes={{
        icon: classes.icon
      }}
      MenuProps={{
        classes: {
          paper: classes.menuPaper,
        }
      }}
      renderValue={(selected) => (
        <div className={classes.chips}>
          {selected.map((value, index) => (
            <Chip key={index} label={value.depositTokenName} className={classes.chip} />
          ))}
        </div>
      )}
      {...rest}
    >
      {items.map((item, index) => (
        <MenuItem
          key={index}
          value={item}
          className={classes.item}
          classes={{
            selected: classes.selected,
          }}
        >
          {item.depositTokenName}
        </MenuItem>
      ))}
    </Select>
  );
});

export default memo(SnowMultiSelect);