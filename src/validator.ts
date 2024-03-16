const validate = (name: string, email: string, password: string, phone_number: string): string | boolean => {
  if (
    !name || !email || !password || !phone_number ||
    name === '' || email === '' || password === '' || phone_number === ''
    ) {
    return 'All fields are required';

  } else if (
    name.split(' ').join('').length < 3 ||
    name.split(' ').join('').length > 20) {
    return 'Name must be between 3 and 20 characters';

  } else if (/[^a-zA-Z\s'-]/.test(name)) {
    return 'Name must only contain letters, spaces, apostrophes, or hyphens';

  } else if (
    !email.includes('@') ||
    !email.includes('.')) {
    return 'Email must be in a valid email format';

  } else if (password.length < 8) {
    return 'Password must be at least 8 characters';

  } else if (phone_number.length !== 10) {
    return 'Phone number must be 10 digits';
    
  }
  else return true;
}

export default validate;

console.log(validate('', '', '', ''))