export interface Question {
  id: string;
  category: "Tip" | "Synonym" | "Inverse" | "Meaning" | "Boss";
  difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const dailyQuestions: Question[] = [
  {
    id: "1",
    category: "Tip",
    difficulty: "Medium",
    question:
      'Complete the sentence: "The marketing team is looking forward to _____ the new campaign results next week."',
    options: ["see", "seeing", "have seen", "be seen"],
    correctIndex: 1,
    explanation:
      '"Look forward to" is a prepositional phrase. Prepositions are ALWAYS followed by a noun or a gerund (-ing form). Never use the base verb after "to" in this specific phrase.',
  },
  {
    id: "2",
    category: "Synonym",
    difficulty: "Hard",
    question:
      'Choose the word that is the closest SYNONYM to the underlined word: "The CEO\'s remarks were highly ephemeral, failing to address the long-term strategy."',
    options: ["Profound", "Fleeting", "Ambiguous", "Substantial"],
    correctIndex: 1,
    explanation:
      '"Ephemeral" means lasting for a very short time. "Fleeting" is the exact synonym. "Profound" and "Substantial" are antonyms.',
  },
  {
    id: "3",
    category: "Inverse",
    difficulty: "Hard",
    question:
      'Choose the exact INVERSE (antonym) of the word mitigate in the context of: "We need to mitigate the risks."',
    options: ["Alleviate", "Exacerbate", "Neutralize", "Obfuscate"],
    correctIndex: 1,
    explanation:
      '"Mitigate" means to make less severe. The exact inverse is "Exacerbate", which means to make worse or more severe.',
  },
  {
    id: "4",
    category: "Meaning",
    difficulty: "Very Hard",
    question:
      'Choose the word that best fits the nuance: "The dark curtains perfectly _____ the gold furniture, creating a luxurious atmosphere."',
    options: ["compliment", "complement", "implement", "complete"],
    correctIndex: 1,
    explanation:
      '"Complement" (with an e) means to enhance or complete something. "Compliment" (with an i) means to give praise. The curtains enhance the room.',
  },
  {
    id: "5",
    category: "Boss",
    difficulty: "Very Hard",
    question:
      '"Had the board of directors been made aware of the discrepancies earlier, the merger _____ without such severe financial repercussions."',
    options: [
      "would proceed",
      "will have proceeded",
      "would have proceeded",
      "had proceeded",
    ],
    correctIndex: 2,
    explanation:
      'This is an Inverted Third Conditional. "Had the board been..." = "If the board had been...". The result clause requires "would have + past participle".',
  },
];
