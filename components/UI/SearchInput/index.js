import React, { memo, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Input, Paper } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    height: theme.spacing(6),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
    backgroundColor: theme.palette.background.primary
  },
  iconButton: {
    color: theme.palette.text.primary,
    transform: 'scale(1, 1)',
    transition: theme.transitions.create(['transform', 'color'], {
      duration: theme.transitions.duration.shorter,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  iconButtonHidden: {
    transform: 'scale(0, 0)',
    '& > $icon': {
      opacity: 0,
    },
  },
  searchIconButton: {
    marginRight: theme.spacing(-6),
  },
  input: {
    width: '100%',
  },
  searchContainer: {
    margin: 'auto 16px',
    width: `calc(100% - ${theme.spacing(6 + 4)}px)`,
  },
}));

const SearchInput = React.forwardRef(
  (
    {
      cancelOnEscape,
      className,
      disabled,
      onCancelSearch,
      onRequestSearch,
      style,
      value,
      onFocus,
      onBlur,
      onChange,
      onKeyUp,
      ...inputProps
    },
    ref
  ) => {
    const classes = useStyles();
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    const handleFocus = useCallback(
      (e) => {
        if (onFocus) {
          onFocus(e);
        }
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e) => {
        setInputValue((v) => v.trim());
        if (onBlur) {
          onBlur(e);
        }
      },
      [onBlur]
    );

    const handleInput = useCallback(
      (e) => {
        setInputValue(e.target.value);
        if (onChange) {
          onChange(e.target.value);
        }
      },
      [onChange]
    );

    const handleCancel = useCallback(() => {
      setInputValue('');
      if (onCancelSearch) {
        onCancelSearch();
      }
    }, [onCancelSearch]);

    const handleRequestSearch = useCallback(() => {
      if (onRequestSearch) {
        onRequestSearch(value);
      }
    }, [onRequestSearch, value]);

    const handleKeyUp = useCallback(
      (e) => {
        if (e.charCode === 13 || e.key === 'Enter') {
          handleRequestSearch();
        } else if (
          cancelOnEscape &&
          (e.charCode === 27 || e.key === 'Escape')
        ) {
          handleCancel();
        }
        if (onKeyUp) {
          onKeyUp(e);
        }
      },
      [handleRequestSearch, cancelOnEscape, handleCancel, onKeyUp]
    );

    return (
      <Paper className={clsx(classes.root, className)} style={style} elevation={0}>
        <div className={classes.searchContainer}>
          <Input
            {...inputProps}
            fullWidth
            disableUnderline
            inputRef={ref}
            onBlur={handleBlur}
            value={inputValue}
            onChange={handleInput}
            onKeyUp={handleKeyUp}
            onFocus={handleFocus}
            className={classes.input}
            disabled={disabled}
          />
        </div>
        <SearchIcon
          onClick={handleRequestSearch}
          className={clsx(classes.iconButton, classes.searchIconButton, {
            [classes.iconButtonHidden]: value !== '',
          })}
          disabled={disabled}
        />
        <ClearIcon
          onClick={handleCancel}
          className={clsx(classes.iconButton, {
            [classes.iconButtonHidden]: value === '',
          })}
          disabled={disabled}
        />
      </Paper>
    );
  }
);

export default memo(SearchInput);
