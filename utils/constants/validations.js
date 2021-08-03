
import * as yup from 'yup'

const BALANCE_VALID = yup.number()
  .typeError('Please enter valid balance')
  .test('balance',
    'This field should be more than 0.',
    value => value > 0)
  .required('Please input field.');

const VOTE_PERIOD_VALID = yup.number()
  .typeError('Please enter valid balance')
  .min(1, 'This field should be more than 1.')
  .max(30, 'This field should be less than 30.')
  .required('Please input field.');

const SELECT_VALID = yup.string()
  .required('Please select one.');

const STRING_VALID = yup.string()
  .required('Please enter this field.');

const SELECT_OBJECT_VALID = yup.object()
  .nullable()
  .required('Please select one.');

const DATE_VALID = yup.string()
  .required('Please select date.');

export {
  SELECT_VALID,
  SELECT_OBJECT_VALID,
  DATE_VALID,
  STRING_VALID,
  BALANCE_VALID,
  VOTE_PERIOD_VALID
};