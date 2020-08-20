const convertBirthDayToAgeRange = (birthday) => {
  const age = new Date().getFullYear() - birthday;
  return Math.floor(age / 10) * 10 + '대';
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

const convertBirthDayToAge = (birthday) => {
  const age = new Date().getFullYear() - birthday;
  return '만 ' + age + '세(' + birthday + ')';
};

const convertJobToString = (jobCode) => {
  switch (jobCode) {
    case 1000:
      return '관리자';
    case 2000:
      return '전문가';
    case 2001:
      return 'IT 종사자';
    case 3000:
      return '사무 종사자';
    case 4000:
      return '서비스 종사자';
    case 5000:
      return '학생';
    case 5003:
      return "초등학생";
    case 5002:
      return "중고등학생";
    case 5001:
      return "대학생";
    case 6000:
      return '판매종사자';
    case 7000:
      return '농림/어업 숙련 종사자';
    case 8000:
      return '기능원 및 관련 기능 종사자';
    case 9000:
      return '장치/기계 조작 및 조립 종사자';
    case 10000:
      return '단순노무 종사자';
    case 11000:
      return '군인';
    case 12000:
      return '기타';
    case 12001:
      return '주부';
    case 12002:
      return '무직';
    default:
      return jobCode;
  }
};

module.exports = {
  convertBirthDayToAgeRange,
  convertGenderToString,
  convertBirthDayToAge,
  convertJobToString,
};
