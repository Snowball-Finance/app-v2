
import { memo, useCallback, useEffect, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useStakingContract } from 'contexts/staking-context'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import SnowTextField from 'components/UI/TextFields/SnowTextField'
import SnowDatePicker from 'components/UI/SnowDatePicker'
import SnowRadio from 'components/UI/SnowRadio'
import { BALANCE_VALID, DATE_VALID, SELECT_VALID } from 'utils/constants/validations'
import DURATIONS from 'utils/constants/staking-durations'
import {
  getDayOffset,
  getWeekDiff,
} from 'utils/helpers/date';
import { estimateXSnobForDate } from 'utils/helpers/stakeDate'
import { AnalyticActions, AnalyticCategories, createEvent, analytics } from "utils/analytics"

const useStyles = makeStyles(() => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
}));

const dateAfter = getDayOffset(new Date(), 7);
const dateBefore = getDayOffset(new Date(), 365 * 2);

const CreateLock = () => {
  const classes = useStyles();
  const { snowballBalance, createLock, loading } = useStakingContract();

  const schema = yup.object().shape({
    balance: BALANCE_VALID.max(snowballBalance, snowballBalance > 0
      ? `This field should be less than ${snowballBalance}.`
      : 'Your balance is 0'),
    date: DATE_VALID.test('date',
      'Date should be in 2 years',
      value => new Date(value) <= dateBefore),
    duration: SELECT_VALID
  });

  const { control, handleSubmit, errors, setValue, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const watchAllFields = watch()

  const onSubmit = useCallback(async (data) => {
    try {
      await createLock(data)
      setValue('balance', 0)
      setValue('date', dateAfter)
      setValue('duration', DURATIONS[0].VALUE)
    } catch (error) {
      console.log(error)
    }
  }, [createLock, setValue]);

  useEffect(() => {
    switch (watchAllFields.duration) {
      case '1':
        setValue('date', getDayOffset(new Date(), 7))
        break;
      case '2':
        setValue('date', getDayOffset(new Date(), 30))
        break;
      case '3':
        setValue('date', getDayOffset(new Date(), 364))
        break;
      case '4':
        setValue('date', getDayOffset(new Date(), 365 * 2))
        break;
      default:
        setValue('date', getDayOffset(new Date(), 7))
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchAllFields.duration]);

  const displayLockTime = useMemo(() => {
    const lockingWeeks = getWeekDiff(new Date(), (watchAllFields?.date || dateAfter));

    if (lockingWeeks < 52) {
      return `${lockingWeeks} week${lockingWeeks > 1 ? 's' : ''}`;
    } else {
      const years = Number(
        (+watchAllFields?.date - +new Date()) / 365 / 1000 / 3600 / 24,
      ).toFixed(0);
      return `${years} ${years === '1' ? 'year' : 'years'} (${lockingWeeks} weeks)`;
    }
  }, [watchAllFields?.date])

  const logSubmit = () => {
    analytics.trackEvent(createEvent({
      action: AnalyticActions.click,
      category: AnalyticCategories.formSubmit,
      name: 'createLock',
    }))
  }

  const onMaxDateSelection = () => {
    setValue('date', dateBefore);
    setValue('duration', DURATIONS[3].VALUE);
  }


  return (
    <form
      noValidate
      className={classes.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography
        variant='body1'
        color='textPrimary'
        gutterBottom
      >
        Each wallet can only lock their SNOB for a single period of time.
        To lock different amounts of SNOB for different periods of time,
        use multiple wallets.
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            as={<SnowTextField />}
            type='number'
            name='balance'
            label={`Balance: ${parseFloat(snowballBalance).toFixed(3) - 0.001}`}
            placeholder='Balance'
            onMax={() => setValue('balance', (parseFloat(snowballBalance).toFixed(3) - 0.001))}
            error={errors.balance?.message}
            control={control}
            defaultValue={0.00}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            as={<SnowDatePicker />}
            name='date'
            label={`Lock for: ${displayLockTime}`}
            placeholder='Date'
            onMax={onMaxDateSelection}
            error={errors.date?.message}
            control={control}
            defaultValue={dateAfter}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant='body1'
            color='textPrimary'
          >
            Note: your selected date will be rounded to the nearest
            weekly xSNOB epoch
          </Typography>
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
          <Typography
            variant='body2'
            color='textPrimary'
          >
            {'You will receive '}
            <b>
              {watchAllFields.balance
                ? estimateXSnobForDate(+watchAllFields.balance, watchAllFields.date).toFixed(4)
                : 0
              }
            </b>
            {' xSnob'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ContainedButton
            fullWidth
            type='submit'
            onClick={logSubmit}
            loading={loading}
          >
            Approve and Create Lock
          </ContainedButton>
        </Grid>
      </Grid>
    </form>
  )
}

export default memo(CreateLock)
