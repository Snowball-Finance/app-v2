
import * as yup from 'yup'
import { minimumVotingPeriod, maximumVotingPeriod } from 'utils/constants/voting-limits'

const BALANCE_VALID = yup.number()
  .typeError('Please enter valid balance')
  .test('balance',
    'This field should be more than 0.',
    value => (value || 0) > 0)
  .required('Please input field.');

const VOTE_PERIOD_VALID = yup.number()
  .typeError('Please enter valid vote period, in days.')
  .integer("Number should be a whole number")
  .min(minimumVotingPeriod, `This field should be more than ${minimumVotingPeriod}.`)
  .max(maximumVotingPeriod, `This field should be less than ${maximumVotingPeriod}.`)
  .required('Please input field.');

const SELECT_VALID = yup.string()
  .required('Please select one.');

const SELECT_OBJECT_VALID = yup.object()
  .nullable()
  .required('Please select one.');

const DATE_VALID = yup.string()
  .required('Please select date.');

export {
  SELECT_VALID,
  SELECT_OBJECT_VALID,
  DATE_VALID,
  BALANCE_VALID,
  VOTE_PERIOD_VALID
};