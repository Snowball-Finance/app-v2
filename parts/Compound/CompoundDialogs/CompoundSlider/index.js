import { memo } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';
import clsx from 'clsx';

import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles((theme) => ({
  barButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: theme.spacing(0.5, 0.25),
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
    width: 48,
    minWidth: 48,
    padding: theme.spacing(0.75, 1),
    '&:hover': {
      backgroundColor: theme.custom.palette.blueButton,
    }
  },
  activeButton: {
    color: theme.custom.palette.white,
    backgroundColor: theme.custom.palette.blue,
    '&:hover': {
      color: theme.custom.palette.white,
      backgroundColor: theme.custom.palette.blue,
    }
  },
}));

const BorderSlider = withStyles(() => ({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -14,
    '&:focus, &:hover': {
      boxShadow: 'inherit',
    },
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
}))(Slider);

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: 'Max',
  },
];

const CompoundSlider = ({ value, onChange }) => {
  const classes = useStyles();

  return (
    <div>
      <BorderSlider
        aria-labelledby="discrete-slider-custom"
        valueLabelDisplay="auto"
        value={value}
        onChange={(e, value) => onChange(value)}
      />
      <div className={classes.barButtons}>
        {marks.map((mark) => (
          <ContainedButton
            key={mark.value}
            onClick={() => onChange(mark.value)}
            className={clsx(classes.button, {
              [classes.activeButton]: mark.value === value,
            })}
            disableElevation
          >
            {mark.label}
          </ContainedButton>
        ))}
      </div>
    </div>
  );
};

export default memo(CompoundSlider);
