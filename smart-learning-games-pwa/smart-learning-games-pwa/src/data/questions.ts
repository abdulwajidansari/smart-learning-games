import type { Question, GameMode, Language, ClassLevel, Difficulty } from "@/types";

// Helper to generate question ID
let questionCounter = 0;
function generateId(): string {
  return `q_${++questionCounter}`;
}

// Reset counter for each section
function resetCounter() {
  questionCounter = 0;
}

// ============================================
// MATH MASTER QUESTIONS
// ============================================

const mathQuestions: Question[] = [];

// Number Recognition & Ordering
function addMathQuestions() {
  resetCounter();
  
  // Class 1 - Number Recognition
  const class1Numbers: Question[] = [
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 1,
      topic: "number_recognition",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which number is five?",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "5" },
        { id: "c", text: "7" },
        { id: "d", text: "2" },
      ],
      correctAnswer: "b",
      explanation: "The number five is written as 5.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 1,
      topic: "number_recognition",
      language: "hindi",
      questionType: "multiple_choice",
      questionText: "पांच कौन सा संख्या है?",
      options: [
        { id: "a", text: "३" },
        { id: "b", text: "५" },
        { id: "c", text: "७" },
        { id: "d", text: "२" },
      ],
      correctAnswer: "b",
      explanation: "पांच संख्या ५ है।",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 1,
      topic: "number_ordering",
      language: "english",
      questionType: "sequence",
      questionText: "Arrange these numbers from smallest to largest: 3, 1, 4, 2",
      options: [
        { id: "1", text: "1" },
        { id: "2", text: "2" },
        { id: "3", text: "3" },
        { id: "4", text: "4" },
      ],
      correctAnswer: ["1", "2", "3", "4"],
      explanation: "Numbers in order: 1, 2, 3, 4",
      difficulty: "easy",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 1,
      topic: "comparisons",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which is greater: 7 or 5?",
      options: [
        { id: "a", text: "5" },
        { id: "b", text: "7" },
        { id: "c", text: "Both are equal" },
      ],
      correctAnswer: "b",
      explanation: "7 is greater than 5.",
      difficulty: "easy",
      estimatedTime: 15,
    },
  ];

  // Class 2 - Addition and Subtraction
  const class2Math: Question[] = [
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 2,
      topic: "addition",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is 12 + 8?",
      options: [
        { id: "a", text: "18" },
        { id: "b", text: "20" },
        { id: "c", text: "19" },
        { id: "d", text: "21" },
      ],
      correctAnswer: "b",
      explanation: "12 + 8 = 20. Count: 12, 13, 14, 15, 16, 17, 18, 19, 20.",
      difficulty: "easy",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 2,
      topic: "subtraction",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is 25 - 17?",
      options: [
        { id: "a", text: "8" },
        { id: "b", text: "7" },
        { id: "c", text: "9" },
        { id: "d", text: "10" },
      ],
      correctAnswer: "a",
      explanation: "25 - 17 = 8. You can count backwards or use subtraction.",
      difficulty: "medium",
      estimatedTime: 25,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 2,
      topic: "place_value",
      language: "english",
      questionType: "multiple_choice",
      questionText: "In the number 35, what is the place value of 3?",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "30" },
        { id: "c", text: "5" },
        { id: "d", text: "35" },
      ],
      correctAnswer: "b",
      explanation: "In 35, 3 is in the tens place, so its value is 30.",
      difficulty: "medium",
      estimatedTime: 20,
    },
  ];

  // Class 3 - Multiplication and Division
  const class3Math: Question[] = [
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 3,
      topic: "multiplication",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is 7 × 6?",
      options: [
        { id: "a", text: "42" },
        { id: "b", text: "36" },
        { id: "c", text: "48" },
        { id: "d", text: "40" },
      ],
      correctAnswer: "a",
      explanation: "7 × 6 = 42. Seven groups of 6 make 42.",
      difficulty: "easy",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 3,
      topic: "division",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is 36 ÷ 9?",
      options: [
        { id: "a", text: "4" },
        { id: "b", text: "5" },
        { id: "c", text: "6" },
        { id: "d", text: "7" },
      ],
      correctAnswer: "a",
      explanation: "36 ÷ 9 = 4. 9 × 4 = 36.",
      difficulty: "medium",
      estimatedTime: 25,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 3,
      topic: "tables",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is 8 × 8?",
      options: [
        { id: "a", text: "56" },
        { id: "b", text: "64" },
        { id: "c", text: "72" },
        { id: "d", text: "48" },
      ],
      correctAnswer: "b",
      explanation: "8 × 8 = 64.",
      difficulty: "easy",
      estimatedTime: 15,
    },
  ];

  // Class 4 - Advanced topics
  const class4Math: Question[] = [
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 4,
      topic: "fractions",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is 1/2 + 1/4?",
      options: [
        { id: "a", text: "1/4" },
        { id: "b", text: "1/2" },
        { id: "c", text: "3/4" },
        { id: "d", text: "2/4" },
      ],
      correctAnswer: "c",
      explanation: "1/2 + 1/4 = 2/4 + 1/4 = 3/4",
      difficulty: "medium",
      estimatedTime: 30,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 4,
      topic: "geometry",
      language: "english",
      questionType: "multiple_choice",
      questionText: "How many sides does a hexagon have?",
      options: [
        { id: "a", text: "4" },
        { id: "b", text: "5" },
        { id: "c", text: "6" },
        { id: "d", text: "8" },
      ],
      correctAnswer: "c",
      explanation: "A hexagon has 6 sides.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 4,
      topic: "word_problems",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Rahul has 24 marbles. He gives 9 to his friend. How many marbles does he have left?",
      options: [
        { id: "a", text: "14" },
        { id: "b", text: "15" },
        { id: "c", text: "16" },
        { id: "d", text: "17" },
      ],
      correctAnswer: "b",
      explanation: "24 - 9 = 15 marbles left.",
      difficulty: "medium",
      estimatedTime: 30,
    },
  ];

  // Class 5 - More advanced
  const class5Math: Question[] = [
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 5,
      topic: "decimals",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is 0.75 + 0.25?",
      options: [
        { id: "a", text: "0.50" },
        { id: "b", text: "0.75" },
        { id: "c", text: "1.00" },
        { id: "d", text: "1.25" },
      ],
      correctAnswer: "c",
      explanation: "0.75 + 0.25 = 1.00",
      difficulty: "medium",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 5,
      topic: "factors_multiples",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which number is a multiple of both 3 and 4?",
      options: [
        { id: "a", text: "6" },
        { id: "b", text: "8" },
        { id: "c", text: "12" },
        { id: "d", text: "10" },
      ],
      correctAnswer: "c",
      explanation: "12 is a multiple of both 3 (3×4) and 4 (4×3).",
      difficulty: "medium",
      estimatedTime: 25,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 5,
      topic: "percentages",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is 50% of 80?",
      options: [
        { id: "a", text: "30" },
        { id: "b", text: "40" },
        { id: "c", text: "50" },
        { id: "d", text: "60" },
      ],
      correctAnswer: "b",
      explanation: "50% means half. Half of 80 is 40.",
      difficulty: "medium",
      estimatedTime: 25,
    },
  ];

  // Class 6-7 - Advanced
  const class67Math: Question[] = [
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 6,
      topic: "hcf_lcm",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is the LCM of 12 and 18?",
      options: [
        { id: "a", text: "12" },
        { id: "b", text: "18" },
        { id: "c", text: "24" },
        { id: "d", text: "36" },
      ],
      correctAnswer: "d",
      explanation: "Multiples of 12: 12, 24, 36, 48... Multiples of 18: 18, 36, 54... LCM is 36.",
      difficulty: "hard",
      estimatedTime: 30,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 7,
      topic: "square_numbers",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is the square root of 144?",
      options: [
        { id: "a", text: "10" },
        { id: "b", text: "12" },
        { id: "c", text: "14" },
        { id: "d", text: "16" },
      ],
      correctAnswer: "b",
      explanation: "12 × 12 = 144, so √144 = 12.",
      difficulty: "medium",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "math_master",
      subject: "math",
      classLevel: 7,
      topic: "ratios",
      language: "english",
      questionType: "multiple_choice",
      questionText: "If the ratio of boys to girls is 3:5, and there are 24 boys, how many girls are there?",
      options: [
        { id: "a", text: "30" },
        { id: "b", text: "35" },
        { id: "c", text: "40" },
        { id: "d", text: "45" },
      ],
      correctAnswer: "c",
      explanation: "Ratio 3:5 means for every 3 boys, there are 5 girls. If 3 parts = 24 boys, 1 part = 8. So 5 parts = 40 girls.",
      difficulty: "hard",
      estimatedTime: 40,
    },
  ];

  mathQuestions.push(...class1Numbers, ...class2Math, ...class3Math, ...class4Math, ...class5Math, ...class67Math);
}

// ============================================
// WORD WIZARD QUESTIONS
// ============================================

const wordQuestions: Question[] = [];

function addWordQuestions() {
  resetCounter();
  
  // Class 1 - Picture to word
  const class1Words: Question[] = [
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 1,
      topic: "picture_to_word",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which word matches the picture of a cat?",
      options: [
        { id: "a", text: "Dog" },
        { id: "b", text: "Cat" },
        { id: "c", text: "Bird" },
        { id: "d", text: "Fish" },
      ],
      correctAnswer: "b",
      explanation: "The picture shows a cat.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "hindi",
      classLevel: 1,
      topic: "picture_to_word",
      language: "hindi",
      questionType: "multiple_choice",
      questionText: "बिल्ली के चित्र का मिलान किस शब्द से होता है?",
      options: [
        { id: "a", text: "कुत्ता" },
        { id: "b", text: "बिल्ली" },
        { id: "c", text: "चिड़िया" },
        { id: "d", text: "मछली" },
      ],
      correctAnswer: "b",
      explanation: "चित्र में बिल्ली है।",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 1,
      topic: "missing_letter",
      language: "english",
      questionType: "fill_blank",
      questionText: "Fill in the missing letter: C _ T",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "E" },
        { id: "c", text: "I" },
        { id: "d", text: "O" },
      ],
      correctAnswer: "a",
      explanation: "CAT - The missing letter is A.",
      difficulty: "easy",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 1,
      topic: "jumbled_word",
      language: "english",
      questionType: "jumbled",
      questionText: "Unscramble: T A C",
      options: [
        { id: "a", text: "CAT" },
        { id: "b", text: "ACT" },
        { id: "c", text: "TAC" },
        { id: "d", text: "CTA" },
      ],
      correctAnswer: "a",
      explanation: "The correct word is CAT.",
      difficulty: "medium",
      estimatedTime: 25,
    },
  ];

  // Class 2 - Word meaning
  const class2Words: Question[] = [
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 2,
      topic: "word_meaning",
      language: "english",
      questionType: "matching",
      questionText: "Match the word with its meaning: Happy",
      options: [
        { id: "a", text: "Sad" },
        { id: "b", text: "Joyful" },
        { id: "c", text: "Angry" },
        { id: "d", text: "Tired" },
      ],
      correctAnswer: "b",
      explanation: "Happy means Joyful.",
      difficulty: "easy",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 2,
      topic: "synonyms",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which word means the same as 'Big'?",
      options: [
        { id: "a", text: "Small" },
        { id: "b", text: "Large" },
        { id: "c", text: "Tiny" },
        { id: "d", text: "Little" },
      ],
      correctAnswer: "b",
      explanation: "Large means the same as Big.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 2,
      topic: "antonyms",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which word is the opposite of 'Hot'?",
      options: [
        { id: "a", text: "Warm" },
        { id: "b", text: "Cold" },
        { id: "c", text: "Hotter" },
        { id: "d", text: "Burning" },
      ],
      correctAnswer: "b",
      explanation: "Cold is the opposite of Hot.",
      difficulty: "easy",
      estimatedTime: 15,
    },
  ];

  // Class 3 - Spelling and grammar
  const class3Words: Question[] = [
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 3,
      topic: "spelling",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which is the correct spelling?",
      options: [
        { id: "a", text: "Recieve" },
        { id: "b", text: "Receive" },
        { id: "c", text: "Recive" },
        { id: "d", text: "Recieve" },
      ],
      correctAnswer: "b",
      explanation: "The correct spelling is Receive.",
      difficulty: "medium",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 3,
      topic: "sentence_construction",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which sentence is correct?",
      options: [
        { id: "a", text: "The cat sat on the mat" },
        { id: "b", text: "The cat on the mat sat" },
        { id: "c", text: "Sat the cat on the mat" },
        { id: "d", text: "On the mat the cat sat" },
      ],
      correctAnswer: "a",
      explanation: "The correct sentence is 'The cat sat on the mat'.",
      difficulty: "medium",
      estimatedTime: 25,
    },
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "hindi",
      classLevel: 3,
      topic: "word_meaning",
      language: "hindi",
      questionType: "multiple_choice",
      questionText: "'सुंदर' का अर्थ क्या है?",
      options: [
        { id: "a", text: "बुरा" },
        { id: "b", text: "खूबसूरत" },
        { id: "c", text: "बड़ा" },
        { id: "d", text: "छोटा" },
      ],
      correctAnswer: "b",
      explanation: "सुंदर का अर्थ खूबसूरत होता है।",
      difficulty: "easy",
      estimatedTime: 15,
    },
  ];

  // Class 4-5
  const class45Words: Question[] = [
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 4,
      topic: "grammar",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which word is a noun?",
      options: [
        { id: "a", text: "Run" },
        { id: "b", text: "Book" },
        { id: "c", text: "Quick" },
        { id: "d", text: "Happily" },
      ],
      correctAnswer: "b",
      explanation: "Book is a noun (a thing). Run is a verb, Quick is an adjective, Happily is an adverb.",
      difficulty: "medium",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "word_wizard",
      subject: "english",
      classLevel: 5,
      topic: "reading_comprehension",
      language: "english",
      questionType: "multiple_choice",
      questionText: "The sun is very hot. It gives us light and heat. What does the sun give us?",
      options: [
        { id: "a", text: "Water" },
        { id: "b", text: "Light and heat" },
        { id: "c", text: "Food" },
        { id: "d", text: "Air" },
      ],
      correctAnswer: "b",
      explanation: "The passage states that the sun gives us light and heat.",
      difficulty: "medium",
      estimatedTime: 30,
    },
  ];

  wordQuestions.push(...class1Words, ...class2Words, ...class3Words, ...class45Words);
}

// ============================================
// SCIENCE EXPLORER QUESTIONS
// ============================================

const scienceQuestions: Question[] = [];

function addScienceQuestions() {
  resetCounter();
  
  // Class 1-2 - Basic science
  const class12Science: Question[] = [
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 1,
      topic: "plants",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What do plants need to grow?",
      options: [
        { id: "a", text: "Water, sunlight, and air" },
        { id: "b", text: "Chocolate and candy" },
        { id: "c", text: "Toys and games" },
        { id: "d", text: "Books and pens" },
      ],
      correctAnswer: "a",
      explanation: "Plants need water, sunlight, and air to grow.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 2,
      topic: "animals",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which animal lives in water?",
      options: [
        { id: "a", text: "Lion" },
        { id: "b", text: "Elephant" },
        { id: "c", text: "Fish" },
        { id: "d", text: "Bird" },
      ],
      correctAnswer: "c",
      explanation: "Fish lives in water.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 2,
      topic: "weather_seasons",
      language: "english",
      questionType: "true_false",
      questionText: "It snows in summer.",
      options: [
        { id: "a", text: "True" },
        { id: "b", text: "False" },
      ],
      correctAnswer: "b",
      explanation: "It does not snow in summer. It snows in winter.",
      difficulty: "easy",
      estimatedTime: 15,
    },
  ];

  // Class 3-4
  const class34Science: Question[] = [
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 3,
      topic: "solar_system",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which planet is closest to the Sun?",
      options: [
        { id: "a", text: "Earth" },
        { id: "b", text: "Mars" },
        { id: "c", text: "Mercury" },
        { id: "d", text: "Venus" },
      ],
      correctAnswer: "c",
      explanation: "Mercury is the closest planet to the Sun.",
      difficulty: "medium",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 3,
      topic: "human_body",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which organ helps us breathe?",
      options: [
        { id: "a", text: "Heart" },
        { id: "b", text: "Lungs" },
        { id: "c", text: "Stomach" },
        { id: "d", text: "Brain" },
      ],
      correctAnswer: "b",
      explanation: "Lungs help us breathe by taking in oxygen and releasing carbon dioxide.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 4,
      topic: "states_of_matter",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What are the three states of matter?",
      options: [
        { id: "a", text: "Solid, liquid, gas" },
        { id: "b", text: "Hot, cold, warm" },
        { id: "c", text: "Big, small, medium" },
        { id: "d", text: "Light, heavy, medium" },
      ],
      correctAnswer: "a",
      explanation: "The three states of matter are solid, liquid, and gas.",
      difficulty: "medium",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 4,
      topic: "water_cycle",
      language: "english",
      questionType: "sequence",
      questionText: "Arrange the water cycle stages in order: Evaporation, Condensation, Rainfall, Collection",
      options: [
        { id: "evaporation", text: "Evaporation" },
        { id: "condensation", text: "Condensation" },
        { id: "rainfall", text: "Rainfall" },
        { id: "collection", text: "Collection" },
      ],
      correctAnswer: ["evaporation", "condensation", "rainfall", "collection"],
      explanation: "Water cycle: Evaporation → Condensation → Rainfall → Collection",
      difficulty: "hard",
      estimatedTime: 30,
    },
  ];

  // Class 5-7
  const class57Science: Question[] = [
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 5,
      topic: "food_nutrition",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which food gives us energy?",
      options: [
        { id: "a", text: "Rice" },
        { id: "b", text: "Water" },
        { id: "c", text: "Salt" },
        { id: "d", text: "Air" },
      ],
      correctAnswer: "a",
      explanation: "Rice and other carbohydrates give us energy.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 6,
      topic: "environment",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is the main cause of air pollution?",
      options: [
        { id: "a", text: "Planting trees" },
        { id: "b", text: "Smoke from vehicles and factories" },
        { id: "c", text: "Cleaning streets" },
        { id: "d", text: "Drinking water" },
      ],
      correctAnswer: "b",
      explanation: "Smoke from vehicles and factories is a main cause of air pollution.",
      difficulty: "medium",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "science_explorer",
      subject: "science",
      classLevel: 7,
      topic: "energy",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which of these is a renewable source of energy?",
      options: [
        { id: "a", text: "Coal" },
        { id: "b", text: "Petrol" },
        { id: "c", text: "Solar" },
        { id: "d", text: "Natural Gas" },
      ],
      correctAnswer: "c",
      explanation: "Solar energy is renewable because it comes from the sun which never runs out.",
      difficulty: "medium",
      estimatedTime: 20,
    },
  ];

  scienceQuestions.push(...class12Science, ...class34Science, ...class57Science);
}

// ============================================
// BRAIN BATTLE QUESTIONS
// ============================================

const brainQuestions: Question[] = [];

function addBrainQuestions() {
  resetCounter();
  
  // Memory Match
  const memoryMatch: Question[] = [
    {
      id: generateId(),
      gameMode: "brain_battle",
      subject: "math",
      classLevel: 1,
      topic: "memory_match",
      language: "english",
      questionType: "memory_match",
      questionText: "Find matching pairs",
      options: [
        { id: "a1", text: "🍎" },
        { id: "a2", text: "🍎" },
        { id: "b1", text: "🍌" },
        { id: "b2", text: "🍌" },
        { id: "c1", text: "🍊" },
        { id: "c2", text: "🍊" },
      ],
      correctAnswer: "a1-a2,b1-b2,c1-c2",
      explanation: "Match identical emojis together.",
      difficulty: "easy",
      estimatedTime: 30,
    },
  ];

  // Pattern Master
  const patternMaster: Question[] = [
    {
      id: generateId(),
      gameMode: "brain_battle",
      subject: "math",
      classLevel: 2,
      topic: "pattern_master",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What comes next: 2, 4, 6, 8, ?",
      options: [
        { id: "a", text: "9" },
        { id: "b", text: "10" },
        { id: "c", text: "11" },
        { id: "d", text: "12" },
      ],
      correctAnswer: "b",
      explanation: "The pattern adds 2 each time. 8 + 2 = 10.",
      difficulty: "easy",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "brain_battle",
      subject: "math",
      classLevel: 3,
      topic: "pattern_master",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What comes next: △, ○, □, △, ○, ?",
      options: [
        { id: "a", text: "△" },
        { id: "b", text: "○" },
        { id: "c", text: "□" },
        { id: "d", text: "★" },
      ],
      correctAnswer: "c",
      explanation: "The pattern is △, ○, □ repeating.",
      difficulty: "medium",
      estimatedTime: 25,
    },
  ];

  // Sequence Solver
  const sequenceSolver: Question[] = [
    {
      id: generateId(),
      gameMode: "brain_battle",
      subject: "math",
      classLevel: 3,
      topic: "sequence_solver",
      language: "english",
      questionType: "sequence",
      questionText: "Complete the sequence: 5, 10, 15, 20, 25, ?",
      options: [
        { id: "a", text: "25" },
        { id: "b", text: "30" },
        { id: "c", text: "35" },
        { id: "d", text: "40" },
      ],
      correctAnswer: "b",
      explanation: "The sequence adds 5 each time. 25 + 5 = 30.",
      difficulty: "easy",
      estimatedTime: 20,
    },
  ];

  // Logic Detective
  const logicDetective: Question[] = [
    {
      id: generateId(),
      gameMode: "brain_battle",
      subject: "math",
      classLevel: 4,
      topic: "logic_detective",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which is the odd one out: Apple, Banana, Carrot, Orange",
      options: [
        { id: "a", text: "Apple" },
        { id: "b", text: "Banana" },
        { id: "c", text: "Carrot" },
        { id: "d", text: "Orange" },
      ],
      correctAnswer: "c",
      explanation: "Carrot is a vegetable. Apple, Banana, and Orange are fruits.",
      difficulty: "medium",
      estimatedTime: 25,
    },
    {
      id: generateId(),
      gameMode: "brain_battle",
      subject: "math",
      classLevel: 5,
      topic: "logic_detective",
      language: "english",
      questionType: "multiple_choice",
      questionText: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?",
      options: [
        { id: "a", text: "True" },
        { id: "b", text: "False" },
      ],
      correctAnswer: "a",
      explanation: "Yes, if Bloops are Razzies and Razzies are Lazzies, then Bloops must be Lazzies.",
      difficulty: "hard",
      estimatedTime: 30,
    },
  ];

  // Visual Focus
  const visualFocus: Question[] = [
    {
      id: generateId(),
      gameMode: "brain_battle",
      subject: "math",
      classLevel: 2,
      topic: "visual_focus",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which shape is different?",
      options: [
        { id: "a", text: "🔴" },
        { id: "b", text: "🔴" },
        { id: "c", text: "🔵" },
        { id: "d", text: "🔴" },
      ],
      correctAnswer: "c",
      explanation: "The blue circle is different from the red circles.",
      difficulty: "easy",
      estimatedTime: 15,
    },
  ];

  brainQuestions.push(...memoryMatch, ...patternMaster, ...sequenceSolver, ...logicDetective, ...visualFocus);
}

// ============================================
// INDIA KNOWLEDGE QUEST QUESTIONS
// ============================================

const indiaQuestions: Question[] = [];

function addIndiaQuestions() {
  resetCounter();
  
  // Indian Geography
  const indianGeography: Question[] = [
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 3,
      topic: "indian_geography",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is the capital of India?",
      options: [
        { id: "a", text: "Mumbai" },
        { id: "b", text: "Delhi" },
        { id: "c", text: "Kolkata" },
        { id: "d", text: "Chennai" },
      ],
      correctAnswer: "b",
      explanation: "New Delhi is the capital of India.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 4,
      topic: "indian_geography",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which is the longest river in India?",
      options: [
        { id: "a", text: "Yamuna" },
        { id: "b", text: "Ganga" },
        { id: "c", text: "Godavari" },
        { id: "d", text: "Narmada" },
      ],
      correctAnswer: "b",
      explanation: "The Ganga (Ganges) is the longest river in India.",
      difficulty: "medium",
      estimatedTime: 20,
    },
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 5,
      topic: "indian_geography",
      language: "english",
      questionType: "multiple_choice",
      questionText: "How many states are there in India?",
      options: [
        { id: "a", text: "25" },
        { id: "b", text: "28" },
        { id: "c", text: "30" },
        { id: "d", text: "32" },
      ],
      correctAnswer: "b",
      explanation: "As of 2024, there are 28 states in India.",
      difficulty: "medium",
      estimatedTime: 20,
    },
  ];

  // Maharashtra Explorer
  const maharashtraExplorer: Question[] = [
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 3,
      topic: "maharashtra_explorer",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is the capital of Maharashtra?",
      options: [
        { id: "a", text: "Pune" },
        { id: "b", text: "Mumbai" },
        { id: "c", text: "Nagpur" },
        { id: "d", text: "Aurangabad" },
      ],
      correctAnswer: "b",
      explanation: "Mumbai is the capital of Maharashtra.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 4,
      topic: "maharashtra_explorer",
      language: "marathi",
      questionType: "multiple_choice",
      questionText: "महाराष्ट्राचे राजधानी कोणते?",
      options: [
        { id: "a", text: "पुणे" },
        { id: "b", text: "मुंबई" },
        { id: "c", text: "नागपूर" },
        { id: "d", text: "औरंगाबाद" },
      ],
      correctAnswer: "b",
      explanation: "मुंबई हे महाराष्ट्राचे राजधानी आहे.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 5,
      topic: "maharashtra_explorer",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which river flows through Nashik?",
      options: [
        { id: "a", text: "Tapti" },
        { id: "b", text: "Godavari" },
        { id: "c", text: "Krishna" },
        { id: "d", text: "Narmada" },
      ],
      correctAnswer: "b",
      explanation: "The Godavari river flows through Nashik.",
      difficulty: "medium",
      estimatedTime: 20,
    },
  ];

  // Indian History
  const indianHistory: Question[] = [
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 4,
      topic: "indian_history",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Who was the first Prime Minister of India?",
      options: [
        { id: "a", text: "Mahatma Gandhi" },
        { id: "b", text: "Jawaharlal Nehru" },
        { id: "c", text: "Sardar Patel" },
        { id: "d", text: "Subhash Chandra Bose" },
      ],
      correctAnswer: "b",
      explanation: "Jawaharlal Nehru was the first Prime Minister of India.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 5,
      topic: "indian_history",
      language: "english",
      questionType: "multiple_choice",
      questionText: "In which year did India gain independence?",
      options: [
        { id: "a", text: "1945" },
        { id: "b", text: "1947" },
        { id: "c", text: "1950" },
        { id: "d", text: "1960" },
      ],
      correctAnswer: "b",
      explanation: "India gained independence on August 15, 1947.",
      difficulty: "medium",
      estimatedTime: 15,
    },
  ];

  // Civics and Constitution
  const civicsConstitution: Question[] = [
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 5,
      topic: "civics_constitution",
      language: "english",
      questionType: "multiple_choice",
      questionText: "What is the national animal of India?",
      options: [
        { id: "a", text: "Lion" },
        { id: "b", text: "Tiger" },
        { id: "c", text: "Elephant" },
        { id: "d", text: "Peacock" },
      ],
      correctAnswer: "b",
      explanation: "The Royal Bengal Tiger is the national animal of India.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "social_studies",
      classLevel: 6,
      topic: "civics_constitution",
      language: "english",
      questionType: "multiple_choice",
      questionText: "How many spokes are there in the Ashoka Chakra?",
      options: [
        { id: "a", text: "20" },
        { id: "b", text: "22" },
        { id: "c", text: "24" },
        { id: "d", text: "26" },
      ],
      correctAnswer: "c",
      explanation: "The Ashoka Chakra has 24 spokes.",
      difficulty: "medium",
      estimatedTime: 20,
    },
  ];

  // General Knowledge
  const generalKnowledge: Question[] = [
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "general_knowledge",
      classLevel: 3,
      topic: "general_knowledge",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which is the national flower of India?",
      options: [
        { id: "a", text: "Rose" },
        { id: "b", text: "Lotus" },
        { id: "c", text: "Marigold" },
        { id: "d", text: "Jasmine" },
      ],
      correctAnswer: "b",
      explanation: "Lotus is the national flower of India.",
      difficulty: "easy",
      estimatedTime: 15,
    },
    {
      id: generateId(),
      gameMode: "india_knowledge_quest",
      subject: "general_knowledge",
      classLevel: 4,
      topic: "general_knowledge",
      language: "english",
      questionType: "multiple_choice",
      questionText: "Which sport is Sachin Tendulkar famous for?",
      options: [
        { id: "a", text: "Football" },
        { id: "b", text: "Hockey" },
        { id: "c", text: "Cricket" },
        { id: "d", text: "Badminton" },
      ],
      correctAnswer: "c",
      explanation: "Sachin Tendulkar is famous for Cricket.",
      difficulty: "medium",
      estimatedTime: 15,
    },
  ];

  indiaQuestions.push(...indianGeography, ...maharashtraExplorer, ...indianHistory, ...civicsConstitution, ...generalKnowledge);
}

// ============================================
// Initialize all questions
// ============================================

addMathQuestions();
addWordQuestions();
addScienceQuestions();
addBrainQuestions();
addIndiaQuestions();

// Combine all questions
export const allQuestions: Question[] = [
  ...mathQuestions,
  ...wordQuestions,
  ...scienceQuestions,
  ...brainQuestions,
  ...indiaQuestions,
];

// Group questions by game mode
export const questionsByGameMode: Record<GameMode, Question[]> = {
  math_master: mathQuestions,
  word_wizard: wordQuestions,
  science_explorer: scienceQuestions,
  brain_battle: brainQuestions,
  india_knowledge_quest: indiaQuestions,
};

// Group questions by class level
export const questionsByClass: Record<ClassLevel, Question[]> = {
  1: allQuestions.filter(q => q.classLevel === 1),
  2: allQuestions.filter(q => q.classLevel === 2),
  3: allQuestions.filter(q => q.classLevel === 3),
  4: allQuestions.filter(q => q.classLevel === 4),
  5: allQuestions.filter(q => q.classLevel === 5),
  6: allQuestions.filter(q => q.classLevel === 6),
  7: allQuestions.filter(q => q.classLevel === 7),
};

// Group questions by language
export const questionsByLanguage: Record<Language, Question[]> = {
  english: allQuestions.filter(q => q.language === "english"),
  hindi: allQuestions.filter(q => q.language === "hindi"),
  marathi: allQuestions.filter(q => q.language === "marathi"),
  urdu: allQuestions.filter(q => q.language === "urdu"),
};

// Get questions for a specific game mode, class, and language
export function getQuestions(
  gameMode: GameMode,
  classLevel: ClassLevel,
  language: Language,
  limit: number = 10
): Question[] {
  const filtered = questionsByGameMode[gameMode]
    .filter(q => q.classLevel <= classLevel)
    .filter(q => q.language === language);
  
  // Shuffle and return limited questions
  return shuffleArray(filtered).slice(0, limit);
}

// Get questions by topic
export function getQuestionsByTopic(
  gameMode: GameMode,
  topic: string,
  classLevel: ClassLevel,
  language: Language,
  limit: number = 10
): Question[] {
  const filtered = questionsByGameMode[gameMode]
    .filter(q => q.topic === topic)
    .filter(q => q.classLevel <= classLevel)
    .filter(q => q.language === language);
  
  return shuffleArray(filtered).slice(0, limit);
}

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Get all topics for a game mode
export function getTopicsForGameMode(gameMode: GameMode): string[] {
  const topics = new Set<string>();
  questionsByGameMode[gameMode].forEach(q => topics.add(q.topic));
  return Array.from(topics);
}

// Get all unique topics across all game modes
export function getAllTopics(): string[] {
  const topics = new Set<string>();
  allQuestions.forEach(q => topics.add(q.topic));
  return Array.from(topics).sort();
}
