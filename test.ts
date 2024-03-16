// console.log(!isNaN(Number("2")));

const nameValid = (name: string): boolean | string => {
  const nameWithoutSpaces = name.split(' ').join('');

  if (nameWithoutSpaces.length >= 3 && nameWithoutSpaces.length <= 20) {
    return true;
  } else {
    return 'Name must be between 3 and 20 characters';
  }
}

console.log(nameValid('     '))