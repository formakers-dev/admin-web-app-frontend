const convertBirthDayToAgeRange = (birthday) => {
  const age = new Date().getFullYear() - birthday;
  return Math.floor(age / 10) * 10 +'대';
};

const convertGenderToString = (gender) => {
  if (gender === 'male') {
    return '남성';
  } else if (gender === 'female') {
    return '여성';
  } else {
    return '';
  }
};

const convertBirthDayToAge = (birthday) =>{
  const age = new Date().getFullYear() - birthday;
  return '만 ' + age + "세(" + birthday + ")"
};

module.exports = {
  convertBirthDayToAgeRange,
  convertGenderToString,
  convertBirthDayToAge
};
