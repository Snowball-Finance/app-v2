
import * as yup from 'yup'

const BALANCE_VALID = yup.number()
  .typeError('Please enter valid balance')
  .test('balance',
    'This field should be more than 0.',
    value => value > 0)
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
  BALANCE_VALID
};