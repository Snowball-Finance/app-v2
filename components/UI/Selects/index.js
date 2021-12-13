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
    backgroundColor: theme.palette.background.primary,
  },
  icon: {
    fill: theme.palette.secondary.main
  }
}));


const renderOptions = (options) => {
  if (!options || !options.length) {
    return <div>No data found</div>;
  }

  return options.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {option.iconComponent && <>
          {option.iconComponent}
          <div style={{ width: '4px' }}></div>
        </>} {option.label}
      </div>
    </MenuItem>
  ));
};

const Selects = React.forwardRef(
  ({ error, className, value, onChange, style, options, startIcon }, ref) => {
    const classes = useStyles();


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
          inputProps={
            {
              classes: {
                icon: classes.icon
              }
            }
          }
          disableUnderline
        >
          {renderOptions(options)}
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
