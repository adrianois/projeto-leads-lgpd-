import validator from 'email-validator';

export function validateEmail(email) {
  return validator.validate(email);
}
