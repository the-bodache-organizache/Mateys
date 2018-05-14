const randomNumber = (length) => {
  return Math.round(Math.random() * length);
}

const shipNameGenerator = (dictionary) => {
  const vowels = "AEIOU";
  const singular = randomNumber(2) === 1;
  const adjectiveIdx = randomNumber(dictionary.adjective.length)
  const adjective = dictionary.adjective[adjectiveIdx];

  let subject;
  let article;
  let subjectIdx;
  if (singular) {
    subjectIdx = randomNumber(dictionary.subject.singular.length);
    subject = dictionary.subject.singular[subjectIdx];
    article = vowels.includes(adjective[0]) ? 'An' : 'A';
  } else {
    subjectIdx = randomNumber(dictionary.subject.plural.length);
    subject = dictionary.subject.plural[subjectIdx];
    article = 'The';
  }

  return `${article} ${adjective} ${subject}`;
}

export default shipNameGenerator;
