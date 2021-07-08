import { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';
import clsx from 'clsx';

import ContainedButton from 'components/UI/Buttons/ContainedButton';

const useStyles = makeStyles((theme) => ({
  barButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    color: theme.palette.text.primary,
    backgroundColor: theme.custom.palette.lightBlue,
  },
  activeButton: {
    color: '#FFFFFF',
    backgroundColor: theme.custom.palette.blue,
  },
}));

const marks = [
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
      <Slider
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
