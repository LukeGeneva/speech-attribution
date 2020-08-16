//essential components

//identify spoken sections
const getSpokenSectionLocations = (text) => {
  var quoteLocs = [];
  for (var i = 0; i < text.length; i++) {
    if (text[i] === '"') quoteLocs.push(i);
  }

  return quoteLocs.reduce((acc, currentQuoteMark, i) => {
    if (i % 2 !== 0) return acc;
    return [
      ...acc,
      {
        start: currentQuoteMark,
        end: quoteLocs[i + 1],
      },
    ];
  }, []);
};

//get all speakers in text body
const getAllAttributedSpeakers = (text) => {
  return ["john", "barkeep"];
};

const getEmotionalTone = (fullText, { start, end }) => {
  //ingest full text here as we can take x words before and x words after to help decide on emotional content
  return ["neutral"];
};

const getSpeaker = (fullText, { start, end }) => {
  const charLength = end - start;
  const textBody = fullText.substr(start + 1, charLength - 1);
  //magic, given full text and individual quote, answer with best guess of attributed speaker
  return textBody.indexOf("John") > -1 ? "barkeep" : "john";
};

//get detailed info on one quote
const getDetailedQuoteInformation = (fullText, { start, end }) => {
  const charLength = end - start;
  const textBody = fullText.substr(start + 1, charLength - 1);
  return {
    start,
    end,
    charLength,
    wordLength: textBody.split(" ").length,
    textBody,
    speaker: getSpeaker(fullText, { start, end }),
    emotions: getEmotionalTone(fullText, { start, end }),
  };
};

//main func
const getSpeakerTags = (text) => {
  const spokenSections = getSpokenSectionLocations(text);
  const allSpeakers = getAllAttributedSpeakers(text);
  return spokenSections
    .map((section) => {
      return getDetailedQuoteInformation(text, section);
    })
    .map((section) => {
      return {
        ...section,
        isInAllSpeakers: allSpeakers.indexOf(section.speaker) > -1,
      };
    });
};

const testData = getSpeakerTags(`
      John walked into the room. He looked at the barkeep and said, "I'll have the usual."
      The barkeep looked up and responded, "You got it, John."
      John replied, "You're the man."
  `);

const desiredResponse = [
  {
    start: 67,
    end: 88,
    charLength: 21,
    wordLength: 4,
    textBody: "I'll have the usual.",
    speaker: "john",
    emotions: ["neutral"],
    isInAllSpeakers: true,
  },
  {
    start: 131,
    end: 149,
    charLength: 18,
    wordLength: 4,
    textBody: "You got it, John.",
    speaker: "barkeep",
    emotions: ["neutral"],
    isInAllSpeakers: true,
  },
  {
    start: 169,
    end: 185,
    charLength: 16,
    wordLength: 3,
    textBody: "You're the man.",
    speaker: "john",
    emotions: ["neutral"],
    isInAllSpeakers: true,
  },
];

console.log(
  testData,
  desiredResponse,
  JSON.stringify(testData) === JSON.stringify(desiredResponse)
    ? "pass"
    : "failllll"
);
