import type { Language } from "./translations";

const topicLabels: Record<string, Partial<Record<Language, string>>> = {
  "Number sense": { en: "Number sense", hi: "संख्या समझ", mr: "संख्या समज", ur: "اعداد کی سمجھ" },
  Addition: { en: "Addition", hi: "जोड़", mr: "बेरीज", ur: "جمع" },
  Subtraction: { en: "Subtraction", hi: "घटाव", mr: "वजाबाकी", ur: "تفریق" },
  "Comparing numbers": { en: "Comparing numbers", hi: "संख्याओं की तुलना", mr: "संख्यांची तुलना", ur: "اعداد کا موازنہ" },
  Shapes: { en: "Shapes", hi: "आकृतियाँ", mr: "आकार", ur: "اشکال" },
  Time: { en: "Time", hi: "समय", mr: "वेळ", ur: "وقت" },
  Multiplication: { en: "Multiplication", hi: "गुणा", mr: "गुणाकार", ur: "ضرب" },
  "Place value": { en: "Place value", hi: "स्थानीय मान", mr: "स्थानिक किंमत", ur: "مقامی قیمت" },
  Fractions: { en: "Fractions", hi: "भिन्न", mr: "अपूर्णांक", ur: "کسر" },
  Vocabulary: { en: "Vocabulary", hi: "शब्दावली", mr: "शब्दसंग्रह", ur: "ذخیرۂ الفاظ" },
  Opposites: { en: "Opposites", hi: "विलोम", mr: "विरुद्धार्थी शब्द", ur: "متضاد الفاظ" },
  Sentences: { en: "Sentences", hi: "वाक्य", mr: "वाक्ये", ur: "جملے" },
  Spelling: { en: "Spelling", hi: "वर्तनी", mr: "शब्दलेखन", ur: "املا" },
  "Parts of speech": { en: "Parts of speech", hi: "शब्द-भेद", mr: "शब्दांच्या जाती", ur: "اقسامِ کلام" },
  Grammar: { en: "Grammar", hi: "व्याकरण", mr: "व्याकरण", ur: "قواعد" },
  "Solar system": { en: "Solar system", hi: "सौरमंडल", mr: "सूर्यमाला", ur: "نظامِ شمسی" },
  Plants: { en: "Plants", hi: "पौधे", mr: "वनस्पती", ur: "پودے" },
  "States of matter": { en: "States of matter", hi: "पदार्थ की अवस्थाएँ", mr: "पदार्थाच्या अवस्था", ur: "مادّے کی حالتیں" },
  Space: { en: "Space", hi: "अंतरिक्ष", mr: "अंतराळ", ur: "خلا" },
  "Human body": { en: "Human body", hi: "मानव शरीर", mr: "मानवी शरीर", ur: "انسانی جسم" },
  "Water cycle": { en: "Water cycle", hi: "जल चक्र", mr: "जलचक्र", ur: "آبی چکر" },
  "Number patterns": { en: "Number patterns", hi: "संख्या पैटर्न", mr: "संख्यांचे नमुने", ur: "اعدادی نمونے" },
  Sorting: { en: "Sorting", hi: "छँटाई", mr: "वर्गीकरण", ur: "ترتیب دینا" },
  Sequences: { en: "Sequences", hi: "क्रम", mr: "क्रम", ur: "ترتیب" },
  Patterns: { en: "Patterns", hi: "पैटर्न", mr: "नमुने", ur: "نمونے" },
  Classification: { en: "Classification", hi: "वर्गीकरण", mr: "वर्गीकरण", ur: "درجہ بندی" },
  "Indian geography": { en: "Indian geography", hi: "भारतीय भूगोल", mr: "भारतीय भूगोल", ur: "بھارت کا جغرافیہ" },
  "National symbols": { en: "National symbols", hi: "राष्ट्रीय प्रतीक", mr: "राष्ट्रीय प्रतीके", ur: "قومی علامات" },
  Maharashtra: { en: "Maharashtra", hi: "महाराष्ट्र", mr: "महाराष्ट्र", ur: "مہاراشٹر" },
  Rivers: { en: "Rivers", hi: "नदियाँ", mr: "नद्या", ur: "دریا" },
  Civics: { en: "Civics", hi: "नागरिक शास्त्र", mr: "नागरिकशास्त्र", ur: "شہریات" },
  "Teacher questions": { en: "Teacher questions", hi: "शिक्षक के सवाल", mr: "शिक्षकांचे प्रश्न", ur: "استاد کے سوال" },
  "Memory match": { en: "Memory match", hi: "याददाश्त मिलान", mr: "स्मरणशक्ती जोडी", ur: "یادداشت کا جوڑا" },
};

export function localizeTopic(topic: string, language: Language): string {
  return topicLabels[topic]?.[language] ?? topic;
}
