import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Select, MenuItem, Paper } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(6),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0, 0.5),
  },
  selectBox: {
    width: '100%',
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.custom.palette.white,
  },
}));

const Selects = React.forwardRef(
  ({ error, className, value, onChange, style, options, startIcon }, ref) => {
    const classes = useStyles();

    const renderOptions = () => {
      if (!options || !options.length) {
        return <div>No data found</div>;
      }

      return options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ));
    };

    return (
      <Paper
        className={clsx(classes.root, className)}
        style={style}
        elevation={0}
      >
        {startIcon}
        <Select
          ref={ref}
          className={classes.selectBox}
          style={{ width: startIcon ? '80%' : '100%' }}
          value={value}
          onChange={onChange}
          disableUnderline
        >
          {renderOptions()}
        </Select>
        {!!error && (
          <Typography variant="subtitle2" color="error">
            {error}
          </Typography>
        )}
      </Paper>
    );
  }
);

export default memo(Selects);
