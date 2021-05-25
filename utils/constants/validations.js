
import * as yup from 'yup'

const BALANCE_VALID = yup.number()
  .typeError('Please enter valid balance')
  .test('balance',
    'This field should be more than 0.',
    value => value > 0)
  .required('Please input field.');

export {
  BALANCE_VALID
};