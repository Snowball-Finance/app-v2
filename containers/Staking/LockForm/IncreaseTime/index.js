
import { memo, useCallback, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useStakingContract } from 'contexts/staking-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import SnowDatePicker from 'components/UI/SnowDatePicker'
import SnowRadio from 'components/UI/SnowRadio'
import { DATE_VALID, SELECT_VALID } from 'utils/constants/validations'
import DURATIONS from 'utils/constants/staking-durations'
import {
  getDayOffset,
  getWeekDiff,
  dateFromEpoch,
} from 'utils/helpers/date';

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

const dateBefore = getDayOffset(new Date(), 365 * 2);

const IncreaseTime = () => {
  const classes = useStyles();
  const { lockEndDate, increaseTime } = useStakingContract();
  const lockEndDateValue = dateFromEpoch(+(lockEndDate?.toString() || 0));
  const dateAfter = getDayOffset(lockEndDateValue, 7);

  const schema = yup.object().shape({
    date: DATE_VALID.test('date',
      'Please adjust date to be 2 years or less',
      value => new Date(value) <= dateBefore),
    duration: SELECT_VALID
  });

  const { control, handleSubmit, errors, setValue, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const watchAllFields = watch()

  const onSubmit = useCallback(async (data) => {
    try {
      await increaseTime(data)
      setValue('date', dateAfter)
      setValue('duration', DURATIONS[0].VALUE)
    } catch (error) {
      console.log(error)
    }
  }, [dateAfter, increaseTime, setValue]);

  useEffect(() => {
    switch (watchAllFields.duration) {
      case '1':
        setValue('date', getDayOffset(lockEndDateValue, 7))
        break;
      case '2':
        setValue('date', getDayOffset(lockEndDateValue, 30))
        break;
      case '3':
        setValue('date', getDayOffset(lockEndDateValue, 364))
        break;
      case '4':
        setValue('date', getDayOffset(lockEndDateValue, 365 * 2))
        break;
      default:
        setValue('date', getDayOffset(lockEndDateValue, 7))
        break;
    }
  }, [watchAllFields.duration]);

  const displayLockTime = useMemo(() => {
    const lockingWeeks = getWeekDiff(lockEndDateValue, (watchAllFields?.date || dateAfter));

    if (lockingWeeks < 52) {
      return `${lockingWeeks} week${lockingWeeks > 1 ? 's' : ''}`;
    } else {
      const years = Number(
        (+watchAllFields?.date - +lockEndDateValue) / 365 / 1000 / 3600 / 24,
      ).toFixed(0);
      return `${years} ${years === '1' ? 'year' : 'years'} (${lockingWeeks} weeks)`;
    }
  }, [watchAllFields?.date, lockEndDateValue, dateAfter])

  return (
    <form
      noValidate
      className={classes.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            as={<SnowDatePicker />}
            name='date'
            label={`Lock for: ${displayLockTime}`}
            placeholder='Date'
            onMax={() => setValue('date', dateBefore)}
            error={errors.date?.message}
            control={control}
            defaultValue={dateAfter}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={<SnowRadio />}
            name='duration'
            items={DURATIONS}
            control={control}
            defaultValue={DURATIONS[0].VALUE}
          />
        </Grid>
        <Grid item xs={12}>
          <ContainedButton
            fullWidth
            type='submit'
          >
            Extend Lock Time
          </ContainedButton>
        </Grid>
      </Grid>
    </form>
  )
}

export default memo(IncreaseTime)