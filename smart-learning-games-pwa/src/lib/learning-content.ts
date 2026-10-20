import type { Language } from "./translations";

export type GameMode = "math" | "words" | "science" | "brain" | "india";
export type Difficulty = "easy" | "medium" | "hard";
export interface LocalizedQuestion {
  prompt: string;
  options: [string, string, string, string];
  explanation: string;
  hint: string;
}
export interface LearningQuestion {
  id: string;
  mode: GameMode;
  topic: string;
  minClass: number;
  difficulty: Difficulty;
  correctIndex: number;
  content: Record<Language, LocalizedQuestion>;
  custom?: boolean;
}

const q = (
  id: string,
  mode: GameMode,
  topic: string,
  minClass: number,
  difficulty: Difficulty,
  correctIndex: number,
  content: Record<Language, LocalizedQuestion>,
): LearningQuestion => ({ id, mode, topic, minClass, difficulty, correctIndex, content });

export const questionBanks: Record<GameMode, LearningQuestion[]> = {
  math: [
    q("m-next-ten", "math", "Number sense", 1, "easy", 1, {
      en: { prompt: "Which number comes right after 9?", options: ["8", "10", "11", "7"], explanation: "Count one step forward from 9: 10 comes next.", hint: "Count 9, then take one more step." },
      hi: { prompt: "9 के ठीक बाद कौन-सी संख्या आती है?", options: ["8", "10", "11", "7"], explanation: "9 के बाद एक गिनें: अगली संख्या 10 है।", hint: "9 के बाद एक कदम आगे गिनें।" },
      mr: { prompt: "9 नंतर लगेच कोणती संख्या येते?", options: ["8", "10", "11", "7"], explanation: "9 नंतर एक संख्या मोजा: पुढे 10 येते.", hint: "9 नंतर एक पाऊल पुढे मोजा." },
      ur: { prompt: "9 کے فوراً بعد کون سا عدد آتا ہے؟", options: ["8", "10", "11", "7"], explanation: "9 کے بعد ایک قدم آگے گنیں: اگلا عدد 10 ہے۔", hint: "9 کے بعد ایک قدم آگے گنیں۔" },
    }),
    q("m-add-six-three", "math", "Addition", 1, "easy", 2, {
      en: { prompt: "What is 6 + 3?", options: ["8", "10", "9", "7"], explanation: "Start at 6 and count 3 more: 7, 8, 9.", hint: "Start with 6 and count three more." },
      hi: { prompt: "6 + 3 कितने होते हैं?", options: ["8", "10", "9", "7"], explanation: "6 से शुरू करके 3 आगे गिनें: 7, 8, 9।", hint: "6 से शुरू करके तीन और गिनें।" },
      mr: { prompt: "6 + 3 किती होतात?", options: ["8", "10", "9", "7"], explanation: "6 पासून पुढे 3 मोजा: 7, 8, 9.", hint: "6 पासून पुढे आणखी तीन मोजा." },
      ur: { prompt: "6 + 3 کتنے ہوتے ہیں؟", options: ["8", "10", "9", "7"], explanation: "6 سے شروع کریں اور 3 آگے گنیں: 7، 8، 9۔", hint: "6 سے شروع کرکے تین قدم آگے گنیں۔" },
    }),
    q("m-sub-ten-four", "math", "Subtraction", 1, "easy", 0, {
      en: { prompt: "Solve: 10 − 4 = ?", options: ["6", "5", "7", "14"], explanation: "Take 4 away from 10. Six remain.", hint: "Count backwards four steps from 10." },
      hi: { prompt: "हल करें: 10 − 4 = ?", options: ["6", "5", "7", "14"], explanation: "10 में से 4 घटाएँ। 6 बचते हैं।", hint: "10 से चार कदम पीछे गिनें।" },
      mr: { prompt: "सोडवा: 10 − 4 = ?", options: ["6", "5", "7", "14"], explanation: "10 मधून 4 वजा केल्यावर 6 उरतात.", hint: "10 पासून चार पावले मागे मोजा." },
      ur: { prompt: "حل کریں: 10 − 4 = ؟", options: ["6", "5", "7", "14"], explanation: "10 میں سے 4 نکالیں تو 6 باقی رہتے ہیں۔", hint: "10 سے چار قدم پیچھے گنیں۔" },
    }),
    q("m-biggest", "math", "Comparing numbers", 1, "medium", 1, {
      en: { prompt: "Which number is greatest?", options: ["14", "19", "11", "16"], explanation: "19 is the greatest because it is more than 14, 11, and 16.", hint: "Compare the tens first, then the ones." },
      hi: { prompt: "इनमें सबसे बड़ी संख्या कौन-सी है?", options: ["14", "19", "11", "16"], explanation: "19 सबसे बड़ी है; यह 14, 11 और 16 से अधिक है।", hint: "पहले दहाइयों, फिर इकाइयों की तुलना करें।" },
      mr: { prompt: "यांपैकी सर्वांत मोठी संख्या कोणती?", options: ["14", "19", "11", "16"], explanation: "19 ही सर्वांत मोठी संख्या आहे; ती 14, 11 आणि 16 पेक्षा मोठी आहे.", hint: "आधी दशकांची, मग एककांची तुलना करा." },
      ur: { prompt: "ان میں سب سے بڑا عدد کون سا ہے؟", options: ["14", "19", "11", "16"], explanation: "19 سب سے بڑا ہے کیونکہ یہ 14، 11 اور 16 سے زیادہ ہے۔", hint: "پہلے دہائیوں، پھر اکائیوں کا موازنہ کریں۔" },
    }),
    q("m-triangle", "math", "Shapes", 1, "easy", 2, {
      en: { prompt: "How many sides does a triangle have?", options: ["2", "4", "3", "5"], explanation: "A triangle is a closed shape with three straight sides.", hint: "The word tri- means three." },
      hi: { prompt: "त्रिभुज की कितनी भुजाएँ होती हैं?", options: ["2", "4", "3", "5"], explanation: "त्रिभुज तीन सीधी भुजाओं वाली बंद आकृति है।", hint: "'त्रि' का अर्थ तीन होता है।" },
      mr: { prompt: "त्रिकोणाला किती बाजू असतात?", options: ["2", "4", "3", "5"], explanation: "त्रिकोण ही तीन सरळ बाजूंची बंद आकृती असते.", hint: "'त्रि' म्हणजे तीन." },
      ur: { prompt: "مثلث کے کتنے ضلع ہوتے ہیں؟", options: ["2", "4", "3", "5"], explanation: "مثلث تین سیدھی لکیروں والا بند شکل ہے۔", hint: "مثلث کے نام میں تین کا مطلب پوشیدہ ہے۔" },
    }),
    q("m-clock", "math", "Time", 1, "medium", 0, {
      en: { prompt: "How many minutes are in one hour?", options: ["60", "30", "24", "100"], explanation: "One hour has 60 minutes.", hint: "A clock face counts up to 60 minutes." },
      hi: { prompt: "एक घंटे में कितने मिनट होते हैं?", options: ["60", "30", "24", "100"], explanation: "एक घंटे में 60 मिनट होते हैं।", hint: "घड़ी के मिनट 60 तक गिने जाते हैं।" },
      mr: { prompt: "एका तासात किती मिनिटे असतात?", options: ["60", "30", "24", "100"], explanation: "एका तासात 60 मिनिटे असतात.", hint: "घड्याळावर मिनिटे 60 पर्यंत मोजली जातात." },
      ur: { prompt: "ایک گھنٹے میں کتنے منٹ ہوتے ہیں؟", options: ["60", "30", "24", "100"], explanation: "ایک گھنٹے میں 60 منٹ ہوتے ہیں۔", hint: "گھڑی پر منٹ 60 تک گنے جاتے ہیں۔" },
    }),
    q("m-times-seven", "math", "Multiplication", 3, "medium", 1, {
      en: { prompt: "What is 7 × 8?", options: ["54", "56", "64", "48"], explanation: "Seven groups of eight make 56. You can also add 8 seven times.", hint: "Think of 7 × 4 = 28, then double it." },
      hi: { prompt: "7 × 8 कितने होते हैं?", options: ["54", "56", "64", "48"], explanation: "आठ के सात समूह 56 होते हैं। 8 को सात बार जोड़कर भी देखें।", hint: "7 × 4 = 28 याद करें, फिर उसे दोगुना करें।" },
      mr: { prompt: "7 × 8 किती होतात?", options: ["54", "56", "64", "48"], explanation: "आठचे सात गट मिळून 56 होतात. 8 सात वेळा जोडूनही पाहा.", hint: "7 × 4 = 28 लक्षात ठेवा आणि त्याची दुप्पट करा." },
      ur: { prompt: "7 × 8 کتنے ہوتے ہیں؟", options: ["54", "56", "64", "48"], explanation: "آٹھ کے سات گروپ 56 ہوتے ہیں۔ 8 کو سات بار جمع کرکے بھی دیکھیں۔", hint: "7 × 4 = 28 سوچیں، پھر اسے دگنا کریں۔" },
    }),
    q("m-place-value", "math", "Place value", 3, "medium", 2, {
      en: { prompt: "In 352, what is the value of the digit 5?", options: ["5", "50", "500", "2"], explanation: "The 5 is in the tens place, so its value is 50.", hint: "Read the places from right to left: ones, tens, hundreds." },
      hi: { prompt: "352 में 5 का स्थानीय मान क्या है?", options: ["5", "50", "500", "2"], explanation: "5 दहाई के स्थान पर है, इसलिए उसका मान 50 है।", hint: "दाएँ से स्थान पढ़ें: इकाई, दहाई, सैकड़ा।" },
      mr: { prompt: "352 मध्ये 5 ची स्थानिक किंमत किती?", options: ["5", "50", "500", "2"], explanation: "5 दशकाच्या स्थानी आहे, म्हणून त्याची किंमत 50 आहे.", hint: "उजवीकडून स्थाने वाचा: एकक, दशक, शतक." },
      ur: { prompt: "352 میں ہندسے 5 کی مقامی قیمت کیا ہے؟", options: ["5", "50", "500", "2"], explanation: "5 دہائیوں کی جگہ پر ہے، اس لیے اس کی قیمت 50 ہے۔", hint: "دائیں سے جگہیں پڑھیں: اکائیاں، دہائیاں، سینکڑے۔" },
    }),
    q("m-fraction", "math", "Fractions", 5, "hard", 0, {
      en: { prompt: "What is 1/2 + 1/4?", options: ["3/4", "2/6", "1/6", "1"], explanation: "One half is 2/4. Then 2/4 + 1/4 = 3/4.", hint: "Write both fractions with a denominator of 4." },
      hi: { prompt: "1/2 + 1/4 कितना है?", options: ["3/4", "2/6", "1/6", "1"], explanation: "1/2 को 2/4 लिख सकते हैं। फिर 2/4 + 1/4 = 3/4।", hint: "दोनों भिन्नों का हर 4 करें।" },
      mr: { prompt: "1/2 + 1/4 किती?", options: ["3/4", "2/6", "1/6", "1"], explanation: "1/2 म्हणजे 2/4. मग 2/4 + 1/4 = 3/4.", hint: "दोन्ही अपूर्णांकांचा छेद 4 करा." },
      ur: { prompt: "1/2 + 1/4 کتنا ہے؟", options: ["3/4", "2/6", "1/6", "1"], explanation: "1/2 کو 2/4 لکھ سکتے ہیں۔ پھر 2/4 + 1/4 = 3/4۔", hint: "دونوں کسرات کا مخرج 4 کریں۔" },
    }),
  ],
  words: [
    q("w-happy", "words", "Vocabulary", 1, "easy", 1, {
      en: { prompt: "Which word means the same as happy?", options: ["narrow", "joyful", "silent", "heavy"], explanation: "Joyful means feeling or showing happiness.", hint: "Think of a word for a person who feels glad." },
      hi: { prompt: "'खुश' का समान अर्थ बताने वाला शब्द कौन-सा है?", options: ["संकरा", "प्रसन्न", "शांत", "भारी"], explanation: "'प्रसन्न' का अर्थ खुश होना है।", hint: "ऐसा शब्द सोचें जिसका अर्थ आनंदित होना है।" },
      mr: { prompt: "'आनंदी' या शब्दाचा समानार्थी शब्द कोणता?", options: ["अरुंद", "हर्षित", "शांत", "जड"], explanation: "'हर्षित' म्हणजे आनंदी किंवा प्रसन्न.", hint: "आनंद झाला आहे, अशा व्यक्तीसाठीचा शब्द आठवा." },
      ur: { prompt: "'خوش' کا ہم معنی لفظ کون سا ہے؟", options: ["تنگ", "شاد", "خاموش", "بھاری"], explanation: "'شاد' کا مطلب خوش یا مسرور ہے۔", hint: "ایسے لفظ پر غور کریں جس کا مطلب خوش ہونا ہے۔" },
    }),
    q("w-opposite-hot", "words", "Opposites", 1, "easy", 0, {
      en: { prompt: "What is the opposite of hot?", options: ["cold", "warm", "bright", "soft"], explanation: "Cold is the opposite of hot.", hint: "Think of ice and snow." },
      hi: { prompt: "'गरम' का विलोम शब्द क्या है?", options: ["ठंडा", "गुनगुना", "चमकीला", "मुलायम"], explanation: "'ठंडा', 'गरम' का विलोम है।", hint: "बर्फ़ और हिम के बारे में सोचें।" },
      mr: { prompt: "'गरम' या शब्दाचा विरुद्धार्थी शब्द कोणता?", options: ["थंड", "कोमट", "तेजस्वी", "मऊ"], explanation: "'थंड' हा 'गरम'चा विरुद्धार्थी शब्द आहे.", hint: "बर्फ आणि हिमाचा विचार करा." },
      ur: { prompt: "'گرم' کا متضاد لفظ کون سا ہے؟", options: ["ٹھنڈا", "نیم گرم", "روشن", "نرم"], explanation: "'ٹھنڈا'، 'گرم' کا متضاد ہے۔", hint: "برف اور یخ بستگی کے بارے میں سوچیں۔" },
    }),
    q("w-sky", "words", "Sentences", 1, "easy", 2, {
      en: { prompt: "Choose the word that completes the sentence: The sun shines in the ___.", options: ["shoe", "book", "sky", "cup"], explanation: "The sun shines in the sky.", hint: "Look up on a clear day." },
      hi: { prompt: "वाक्य पूरा करने वाला शब्द चुनें: सूरज ___ में चमकता है।", options: ["जूते", "किताब", "आकाश", "कप"], explanation: "सूरज आकाश में चमकता है।", hint: "साफ़ दिन में ऊपर देखें।" },
      mr: { prompt: "वाक्य पूर्ण करणारा शब्द निवडा: सूर्य ___ मध्ये चमकतो.", options: ["बूट", "पुस्तक", "आकाश", "कप"], explanation: "सूर्य आकाशात चमकतो.", hint: "स्वच्छ दिवशी वर आकाशाकडे पाहा." },
      ur: { prompt: "جملہ مکمل کرنے والا لفظ چنیں: سورج ___ میں چمکتا ہے۔", options: ["جوتے", "کتاب", "آسمان", "پیالی"], explanation: "سورج آسمان میں چمکتا ہے۔", hint: "صاف دن میں اوپر دیکھیں۔" },
    }),
    q("w-fruit", "words", "Vocabulary", 1, "easy", 1, {
      en: { prompt: "Which word names a fruit?", options: ["chair", "mango", "pencil", "shoe"], explanation: "A mango is a fruit. The other choices are objects.", hint: "This sweet fruit has a large stone inside." },
      hi: { prompt: "कौन-सा शब्द एक फल का नाम है?", options: ["कुर्सी", "आम", "पेंसिल", "जूता"], explanation: "आम एक फल है। बाकी विकल्प वस्तुएँ हैं।", hint: "इस मीठे फल के अंदर बड़ी गुठली होती है।" },
      mr: { prompt: "कोणता शब्द फळाचे नाव आहे?", options: ["खुर्ची", "आंबा", "पेन्सिल", "बूट"], explanation: "आंबा हे फळ आहे. बाकी पर्याय वस्तू आहेत.", hint: "या गोड फळात मोठी कोय असते." },
      ur: { prompt: "کون سا لفظ ایک پھل کا نام ہے؟", options: ["کرسی", "آم", "پنسل", "جوتا"], explanation: "آم ایک پھل ہے۔ باقی انتخاب چیزوں کے نام ہیں۔", hint: "اس میٹھے پھل کے اندر بڑی گٹھلی ہوتی ہے۔" },
    }),
    q("w-spelling", "words", "Spelling", 1, "medium", 2, {
      en: { prompt: "Choose the correctly spelled word.", options: ["becaus", "beacause", "because", "becose"], explanation: "The correct spelling is because: b-e-c-a-u-s-e.", hint: "The middle letters are e-c-a-u." },
      hi: { prompt: "सही वर्तनी वाला शब्द चुनें।", options: ["कीताब", "किताप", "किताब", "कीताप"], explanation: "सही वर्तनी 'किताब' है।", hint: "इस शब्द में 'कि' के बाद 'ता' आता है।" },
      mr: { prompt: "योग्य शब्दलेखन असलेला शब्द निवडा.", options: ["पुसतक", "पुस्तक", "पुस्तीक", "पूसतक"], explanation: "योग्य शब्दलेखन 'पुस्तक' असे आहे.", hint: "या शब्दात 'स्त' ही अक्षरे एकत्र येतात." },
      ur: { prompt: "درست ہجے والا لفظ چنیں۔", options: ["کتپ", "کیتاب", "کتاب", "کتابہ"], explanation: "درست املا 'کتاب' ہے۔", hint: "یہ چار حروف پر مشتمل ایک عام لفظ ہے۔" },
    }),
    q("w-action", "words", "Parts of speech", 3, "medium", 1, {
      en: { prompt: "Which word is an action word (verb)?", options: ["soft", "dance", "blue", "table"], explanation: "Dance names an action, so it is a verb.", hint: "Which word tells what someone can do?" },
      hi: { prompt: "कौन-सा शब्द काम बताता है (क्रिया है)?", options: ["मुलायम", "नाचना", "नीला", "मेज़"], explanation: "'नाचना' एक काम बताता है, इसलिए यह क्रिया है।", hint: "कौन-सा शब्द बताता है कि कोई क्या कर सकता है?" },
      mr: { prompt: "कोणता शब्द कृती दर्शवतो (क्रियापद आहे)?", options: ["मऊ", "नाचणे", "निळा", "टेबल"], explanation: "'नाचणे' ही कृती आहे, म्हणून ते क्रियापद आहे.", hint: "कोणता शब्द एखादी व्यक्ती काय करू शकते हे सांगतो?" },
      ur: { prompt: "کون سا لفظ کام کرنا بتاتا ہے (فعل ہے)؟", options: ["نرم", "ناچنا", "نیلا", "میز"], explanation: "'ناچنا' ایک عمل ہے، اس لیے یہ فعل ہے۔", hint: "کون سا لفظ بتاتا ہے کہ کوئی کیا کر سکتا ہے؟" },
    }),
    q("w-past", "words", "Grammar", 5, "hard", 0, {
      en: { prompt: "Which word is the past tense of go?", options: ["went", "goes", "going", "gone-ing"], explanation: "Went is the simple past tense of go.", hint: "Yesterday I ___ to the park." },
      hi: { prompt: "'जाना' क्रिया का भूतकाल वाला सही रूप चुनें।", options: ["गया", "जाता", "जाना", "जाएगा"], explanation: "'गया' बीते समय में जाने को बताता है।", hint: "कल वह बाज़ार ___." },
      mr: { prompt: "'जाणे' या क्रियापदाचा भूतकाळातील योग्य रूप निवडा.", options: ["गेला", "जातो", "जाणे", "जाईल"], explanation: "'गेला' हे भूतकाळात जाणे दर्शवते.", hint: "काल तो शाळेत ___." },
      ur: { prompt: "'جانا' فعل کی ماضی کی درست شکل چنیں۔", options: ["گیا", "جاتا ہے", "جانا", "جائے گا"], explanation: "'گیا' گزرے ہوئے وقت میں جانے کو ظاہر کرتا ہے۔", hint: "کل وہ بازار ___." },
    }),
  ],
  science: [
    q("s-earth", "science", "Solar system", 1, "easy", 1, {
      en: { prompt: "Which planet is our home?", options: ["Mars", "Earth", "Venus", "Jupiter"], explanation: "We live on Earth, the third planet from the Sun.", hint: "It is the only planet currently known to support life." },
      hi: { prompt: "हमारा घर कौन-सा ग्रह है?", options: ["मंगल", "पृथ्वी", "शुक्र", "बृहस्पति"], explanation: "हम पृथ्वी पर रहते हैं। यह सूर्य से तीसरा ग्रह है।", hint: "अभी तक जीवन वाला ज्ञात ग्रह यही है।" },
      mr: { prompt: "आपला ग्रह कोणता आहे?", options: ["मंगळ", "पृथ्वी", "शुक्र", "गुरू"], explanation: "आपण पृथ्वीवर राहतो. ती सूर्यापासून तिसरा ग्रह आहे.", hint: "जीवन असलेला ज्ञात ग्रह हाच आहे." },
      ur: { prompt: "ہمارا گھر کون سا سیارہ ہے؟", options: ["مریخ", "زمین", "زہرہ", "مشتری"], explanation: "ہم زمین پر رہتے ہیں، جو سورج سے تیسرا سیارہ ہے۔", hint: "اب تک زندگی کے لیے معلوم واحد سیارہ یہی ہے۔" },
    }),
    q("s-leaves", "science", "Plants", 1, "easy", 0, {
      en: { prompt: "Which plant part usually makes food using sunlight?", options: ["leaves", "roots", "flowers", "seeds"], explanation: "Most green leaves use sunlight, water, and carbon dioxide to make food by photosynthesis.", hint: "Look for the flat, green parts of a plant." },
      hi: { prompt: "पौधे का कौन-सा भाग आमतौर पर धूप से भोजन बनाता है?", options: ["पत्तियाँ", "जड़ें", "फूल", "बीज"], explanation: "अधिकांश हरी पत्तियाँ प्रकाश-संश्लेषण में धूप, पानी और कार्बन डाइऑक्साइड से भोजन बनाती हैं।", hint: "पौधे के चपटे हरे भागों को देखें।" },
      mr: { prompt: "वनस्पतीचा कोणता भाग साधारणपणे सूर्यप्रकाश वापरून अन्न तयार करतो?", options: ["पाने", "मुळे", "फुले", "बिया"], explanation: "बहुतेक हिरवी पाने प्रकाशसंश्लेषणाद्वारे सूर्यप्रकाश, पाणी आणि कार्बन डायऑक्साइड वापरून अन्न बनवतात.", hint: "वनस्पतीचे सपाट हिरवे भाग पहा." },
      ur: { prompt: "پودے کا کون سا حصہ عموماً دھوپ سے غذا بناتا ہے؟", options: ["پتے", "جڑیں", "پھول", "بیج"], explanation: "زیادہ تر سبز پتے ضیائی تالیف کے ذریعے دھوپ، پانی اور کاربن ڈائی آکسائیڈ سے غذا بناتے ہیں۔", hint: "پودے کے چپٹے سبز حصوں کو دیکھیں۔" },
    }),
    q("s-ice", "science", "States of matter", 1, "easy", 2, {
      en: { prompt: "What does ice become when it melts?", options: ["steam only", "sand", "liquid water", "stone"], explanation: "Ice is solid water. When it melts, it becomes liquid water.", hint: "Think of a melting ice cube in a glass." },
      hi: { prompt: "बर्फ़ पिघलने पर क्या बनती है?", options: ["केवल भाप", "रेत", "तरल पानी", "पत्थर"], explanation: "बर्फ़ ठोस पानी है। पिघलने पर यह तरल पानी बनती है।", hint: "गिलास में पिघलती बर्फ़ के बारे में सोचें।" },
      mr: { prompt: "बर्फ वितळल्यावर तिचे काय होते?", options: ["फक्त वाफ", "वाळू", "द्रवरूप पाणी", "दगड"], explanation: "बर्फ हे पाण्याचे घनरूप आहे. वितळल्यावर त्याचे द्रवरूप पाणी होते.", hint: "ग्लासमधील वितळणाऱ्या बर्फाचा विचार करा." },
      ur: { prompt: "برف پگھلنے پر کیا بنتی ہے؟", options: ["صرف بھاپ", "ریت", "مائع پانی", "پتھر"], explanation: "برف پانی کی ٹھوس شکل ہے۔ پگھلنے پر یہ مائع پانی بنتی ہے۔", hint: "گلاس میں پگھلتے ہوئے برف کے ٹکڑے کا سوچیں۔" },
    }),
    q("s-sun", "science", "Space", 1, "easy", 2, {
      en: { prompt: "What is the Sun?", options: ["a planet", "a moon", "a star", "a comet"], explanation: "The Sun is a star at the center of our solar system.", hint: "It makes its own light." },
      hi: { prompt: "सूर्य क्या है?", options: ["एक ग्रह", "एक चंद्रमा", "एक तारा", "एक धूमकेतु"], explanation: "सूर्य हमारे सौरमंडल के केंद्र में स्थित एक तारा है।", hint: "यह अपनी रोशनी स्वयं बनाता है।" },
      mr: { prompt: "सूर्य काय आहे?", options: ["एक ग्रह", "एक चंद्र", "एक तारा", "एक धूमकेतू"], explanation: "सूर्य आपल्या सूर्यमालेच्या केंद्रस्थानी असलेला तारा आहे.", hint: "तो स्वतःचा प्रकाश निर्माण करतो." },
      ur: { prompt: "سورج کیا ہے؟", options: ["ایک سیارہ", "ایک چاند", "ایک ستارہ", "ایک دمدار ستارہ"], explanation: "سورج ہمارے نظامِ شمسی کے مرکز میں ایک ستارہ ہے۔", hint: "یہ اپنی روشنی خود بناتا ہے۔" },
    }),
    q("s-lungs", "science", "Human body", 1, "medium", 0, {
      en: { prompt: "Which organs help us breathe?", options: ["lungs", "knees", "ears", "teeth"], explanation: "Our lungs take oxygen from the air and release carbon dioxide when we breathe.", hint: "They expand and shrink inside your chest." },
      hi: { prompt: "साँस लेने में कौन-से अंग मदद करते हैं?", options: ["फेफड़े", "घुटने", "कान", "दाँत"], explanation: "साँस लेते समय फेफड़े हवा से ऑक्सीजन लेते हैं और कार्बन डाइऑक्साइड बाहर निकालते हैं।", hint: "वे छाती के अंदर फैलते और सिकुड़ते हैं।" },
      mr: { prompt: "श्वास घेण्यास कोणते अवयव मदत करतात?", options: ["फुफ्फुसे", "गुडघे", "कान", "दात"], explanation: "श्वास घेताना फुफ्फुसे हवेतून ऑक्सिजन घेतात आणि कार्बन डायऑक्साइड बाहेर सोडतात.", hint: "ते छातीच्या आत फुगतात आणि आकुंचन पावतात." },
      ur: { prompt: "سانس لینے میں کون سے اعضا مدد کرتے ہیں؟", options: ["پھیپھڑے", "گھٹنے", "کان", "دانت"], explanation: "سانس لیتے وقت پھیپھڑے ہوا سے آکسیجن لیتے اور کاربن ڈائی آکسائیڈ خارج کرتے ہیں۔", hint: "یہ سینے کے اندر پھیلتے اور سکڑتے ہیں۔" },
    }),
    q("s-rain", "science", "Water cycle", 1, "medium", 1, {
      en: { prompt: "What often falls from clouds as part of the water cycle?", options: ["leaves", "rain", "rocks", "sunlight"], explanation: "When water droplets in clouds grow heavy, they can fall as rain.", hint: "It is water that comes down from a rainy cloud." },
      hi: { prompt: "जल चक्र में बादलों से अक्सर क्या गिरता है?", options: ["पत्तियाँ", "बारिश", "पत्थर", "धूप"], explanation: "बादलों में पानी की बूँदें भारी होने पर बारिश के रूप में गिर सकती हैं।", hint: "बारिश वाले बादल से पानी नीचे आता है।" },
      mr: { prompt: "जलचक्रात ढगांमधून अनेकदा काय पडते?", options: ["पाने", "पाऊस", "दगड", "सूर्यप्रकाश"], explanation: "ढगांतील पाण्याचे थेंब जड झाल्यावर पावसाच्या रूपाने खाली पडू शकतात.", hint: "पावसाळी ढगातून पाणी खाली येते." },
      ur: { prompt: "آبی چکر کے دوران بادلوں سے اکثر کیا گرتا ہے؟", options: ["پتے", "بارش", "پتھر", "دھوپ"], explanation: "جب بادلوں میں پانی کے قطرے بھاری ہو جاتے ہیں تو وہ بارش بن کر گر سکتے ہیں۔", hint: "بارش والے بادل سے پانی نیچے آتا ہے۔" },
    }),
    q("s-roots-water", "science", "Plants", 3, "medium", 0, {
      en: { prompt: "Which plant part usually takes in water from the soil?", options: ["roots", "petals", "fruit", "pollen"], explanation: "Roots absorb water and minerals from the soil; root structure varies between plants.", hint: "They are often below the ground." },
      hi: { prompt: "मिट्टी से पानी आमतौर पर पौधे का कौन-सा भाग सोखता है?", options: ["जड़ें", "पंखुड़ियाँ", "फल", "पराग"], explanation: "जड़ें मिट्टी से पानी और खनिज सोखती हैं; अलग-अलग पौधों की जड़ें अलग हो सकती हैं।", hint: "ये अक्सर ज़मीन के नीचे होती हैं।" },
      mr: { prompt: "मातीतून पाणी साधारणपणे वनस्पतीचा कोणता भाग शोषून घेतो?", options: ["मुळे", "पाकळ्या", "फळ", "परागकण"], explanation: "मुळे मातीतून पाणी आणि खनिजे शोषतात; वेगवेगळ्या वनस्पतींची मुळे वेगळी असू शकतात.", hint: "हा भाग अनेकदा जमिनीखाली असतो." },
      ur: { prompt: "مٹی سے پانی عموماً پودے کا کون سا حصہ جذب کرتا ہے؟", options: ["جڑیں", "پنکھڑیاں", "پھل", "زرِ گل"], explanation: "جڑیں مٹی سے پانی اور معدنی اجزا جذب کرتی ہیں؛ پودوں کی جڑیں مختلف شکلوں کی ہو سکتی ہیں۔", hint: "یہ عموماً زمین کے نیچے ہوتی ہیں۔" },
    }),
    q("s-evaporation", "science", "Water cycle", 5, "hard", 1, {
      en: { prompt: "What is evaporation?", options: ["liquid water changing into water vapour", "water vapour turning into ice", "rain soaking into soil", "ice changing into liquid"], explanation: "Evaporation changes liquid water into water vapour, often faster when it is warmer.", hint: "A puddle getting smaller on a warm day is an example." },
      hi: { prompt: "वाष्पीकरण क्या है?", options: ["तरल पानी का जलवाष्प बनना", "जलवाष्प का बर्फ़ बनना", "बारिश का मिट्टी में सोखना", "बर्फ़ का पानी बनना"], explanation: "वाष्पीकरण में तरल पानी जलवाष्प बनता है; गर्मी में यह अक्सर तेज़ होता है।", hint: "गर्म दिन में छोटा होता पानी का गड्ढा इसका उदाहरण है।" },
      mr: { prompt: "बाष्पीभवन म्हणजे काय?", options: ["द्रवरूप पाणी वाफेत बदलणे", "वाफेचे बर्फ होणे", "पाऊस मातीत मुरणे", "बर्फाचे द्रव होणे"], explanation: "बाष्पीभवनात द्रवरूप पाणी वाफेत बदलते; उष्णतेने ही प्रक्रिया अनेकदा जलद होते.", hint: "उबदार दिवशी लहान होणारे डबके हे एक उदाहरण आहे." },
      ur: { prompt: "تبخیر کیا ہے؟", options: ["مائع پانی کا آبی بخارات بننا", "بخارات کا برف بننا", "بارش کا مٹی میں جذب ہونا", "برف کا پانی بننا"], explanation: "تبخیر میں مائع پانی آبی بخارات بنتا ہے؛ گرمی میں یہ عمل عموماً تیز ہوتا ہے۔", hint: "گرم دن میں چھوٹا ہوتا ہوا پانی کا گڑھا اس کی مثال ہے۔" },
    }),
  ],
  brain: [
    q("b-count-even", "brain", "Number patterns", 1, "easy", 2, {
      en: { prompt: "Find the next number: 2, 4, 6, __", options: ["7", "10", "8", "12"], explanation: "The pattern adds 2 each time: 2, 4, 6, 8.", hint: "The numbers go up by the same amount each time." },
      hi: { prompt: "अगली संख्या बताइए: 2, 4, 6, __", options: ["7", "10", "8", "12"], explanation: "हर बार 2 जुड़ता है: 2, 4, 6, 8।", hint: "हर बार संख्या एक जैसी मात्रा से बढ़ती है।" },
      mr: { prompt: "पुढील संख्या शोधा: 2, 4, 6, __", options: ["7", "10", "8", "12"], explanation: "प्रत्येक वेळी 2 मिळवा: 2, 4, 6, 8.", hint: "प्रत्येक वेळी संख्या तेवढ्याच प्रमाणात वाढते." },
      ur: { prompt: "اگلا عدد بتائیں: 2، 4، 6، __", options: ["7", "10", "8", "12"], explanation: "ہر بار 2 جمع ہوتا ہے: 2، 4، 6، 8۔", hint: "ہر بار عدد ایک جیسی مقدار سے بڑھتا ہے۔" },
    }),
    q("b-odd-vegetable", "brain", "Sorting", 1, "easy", 3, {
      en: { prompt: "Which one does not belong with the fruits?", options: ["apple", "mango", "banana", "carrot"], explanation: "Carrot is a root vegetable. The other choices are fruits.", hint: "One of these grows as a root vegetable." },
      hi: { prompt: "फलों के समूह में कौन शामिल नहीं होता?", options: ["सेब", "आम", "केला", "गाजर"], explanation: "गाजर जड़ वाली सब्ज़ी है। बाकी फल हैं।", hint: "इनमें से एक जड़ वाली सब्ज़ी है।" },
      mr: { prompt: "फळांच्या गटात कोणते बसत नाही?", options: ["सफरचंद", "आंबा", "केळे", "गाजर"], explanation: "गाजर ही मुळभाजी आहे. बाकी फळे आहेत.", hint: "यापैकी एक भाजीचे मूळ आहे." },
      ur: { prompt: "پھلوں کے گروہ میں کون شامل نہیں؟", options: ["سیب", "آم", "کیلا", "گاجر"], explanation: "گاجر جڑ والی سبزی ہے۔ باقی انتخاب پھل ہیں۔", hint: "ان میں سے ایک جڑ والی سبزی ہے۔" },
    }),
    q("b-days", "brain", "Sequences", 1, "easy", 1, {
      en: { prompt: "What day comes after Tuesday?", options: ["Monday", "Wednesday", "Thursday", "Sunday"], explanation: "Wednesday comes after Tuesday in the seven-day week.", hint: "The first sound of the answer is 'W'." },
      hi: { prompt: "मंगलवार के बाद कौन-सा दिन आता है?", options: ["सोमवार", "बुधवार", "गुरुवार", "रविवार"], explanation: "सात दिनों वाले सप्ताह में मंगलवार के बाद बुधवार आता है।", hint: "हफ़्ते के दिनों का क्रम याद करें।" },
      mr: { prompt: "मंगळवारानंतर कोणता वार येतो?", options: ["सोमवार", "बुधवार", "गुरुवार", "रविवार"], explanation: "सात दिवसांच्या आठवड्यात मंगळवारानंतर बुधवार येतो.", hint: "आठवड्यातील दिवसांचा क्रम आठवा." },
      ur: { prompt: "منگل کے بعد کون سا دن آتا ہے؟", options: ["پیر", "بدھ", "جمعرات", "اتوار"], explanation: "سات دن کے ہفتے میں منگل کے بعد بدھ آتا ہے۔", hint: "ہفتے کے دنوں کی ترتیب یاد کریں۔" },
    }),
    q("b-verb-sequence", "brain", "Patterns", 1, "medium", 0, {
      en: { prompt: "Complete the pattern: clap, tap, clap, tap, __", options: ["clap", "jump", "tap", "sleep"], explanation: "The pattern alternates: clap, tap, clap, tap, so clap comes next.", hint: "The two actions take turns." },
      hi: { prompt: "पैटर्न पूरा करें: ताली, थपकी, ताली, थपकी, __", options: ["ताली", "कूदना", "थपकी", "सोना"], explanation: "यह क्रम बारी-बारी से चलता है: ताली, थपकी। अगली ताली है।", hint: "दो काम बारी-बारी से आते हैं।" },
      mr: { prompt: "रचना पूर्ण करा: टाळी, थाप, टाळी, थाप, __", options: ["टाळी", "उडी", "थाप", "झोप"], explanation: "ही रचना आलटून-पालटून आहे: टाळी, थाप; म्हणून पुढे टाळी.", hint: "दोन कृती आलटून-पालटून येतात." },
      ur: { prompt: "ترتیب مکمل کریں: تالی، تھپکی، تالی، تھپکی، __", options: ["تالی", "چھلانگ", "تھپکی", "نیند"], explanation: "ترتیب میں دونوں عمل باری باری آتے ہیں: تالی، تھپکی، پھر تالی۔", hint: "دو کام ایک کے بعد ایک باری باری آتے ہیں۔" },
    }),
    q("b-shape-odd", "brain", "Classification", 1, "medium", 2, {
      en: { prompt: "Which one is a shape with straight sides?", options: ["cloud", "rainbow", "triangle", "smoke"], explanation: "A triangle has three straight sides. Clouds, rainbows, and smoke have no straight sides.", hint: "It has three corners." },
      hi: { prompt: "इनमें सीधी भुजाओं वाली आकृति कौन-सी है?", options: ["बादल", "इंद्रधनुष", "त्रिभुज", "धुआँ"], explanation: "त्रिभुज की तीन सीधी भुजाएँ होती हैं। बाकी विकल्पों की सीधी भुजाएँ नहीं होतीं।", hint: "इसके तीन कोने होते हैं।" },
      mr: { prompt: "यांपैकी सरळ बाजू असलेली आकृती कोणती?", options: ["ढग", "इंद्रधनुष्य", "त्रिकोण", "धूर"], explanation: "त्रिकोणाला तीन सरळ बाजू असतात. बाकी पर्यायांना सरळ बाजू नसतात.", hint: "त्याला तीन कोपरे असतात." },
      ur: { prompt: "ان میں سے سیدھے ضلعوں والی شکل کون سی ہے؟", options: ["بادل", "قوسِ قزح", "مثلث", "دھواں"], explanation: "مثلث کے تین سیدھے ضلع ہوتے ہیں۔ باقی انتخابوں کے سیدھے ضلع نہیں ہوتے۔", hint: "اس کے تین کونے ہیں۔" },
    }),
    q("b-mammal-odd", "brain", "Classification", 1, "medium", 1, {
      en: { prompt: "Which animal is a bird, not a mammal?", options: ["dog", "sparrow", "cow", "cat"], explanation: "A sparrow is a bird. Dogs, cows, and cats are mammals.", hint: "This small animal has feathers and can fly." },
      hi: { prompt: "कौन-सा जानवर स्तनधारी नहीं, बल्कि पक्षी है?", options: ["कुत्ता", "गौरैया", "गाय", "बिल्ली"], explanation: "गौरैया एक पक्षी है। कुत्ता, गाय और बिल्ली स्तनधारी हैं।", hint: "यह छोटा जानवर पंखों वाला है और उड़ सकता है।" },
      mr: { prompt: "कोणता प्राणी सस्तन नसून पक्षी आहे?", options: ["कुत्रा", "चिमणी", "गाय", "मांजर"], explanation: "चिमणी हा पक्षी आहे. कुत्रा, गाय आणि मांजर हे सस्तन प्राणी आहेत.", hint: "हा लहान पिसांचा प्राणी उडू शकतो." },
      ur: { prompt: "کون سا جانور ممالیہ نہیں بلکہ پرندہ ہے؟", options: ["کتا", "چڑیا", "گائے", "بلی"], explanation: "چڑیا ایک پرندہ ہے۔ کتا، گائے اور بلی ممالیہ ہیں۔", hint: "یہ چھوٹا جانور پروں والا ہے اور اڑ سکتا ہے۔" },
    }),
    q("b-triple-sequence", "brain", "Number patterns", 3, "medium", 2, {
      en: { prompt: "Find the next number: 3, 6, 12, __", options: ["15", "18", "24", "21"], explanation: "Each number doubles: 3 × 2 = 6, 6 × 2 = 12, and 12 × 2 = 24.", hint: "Multiply each number by 2." },
      hi: { prompt: "अगली संख्या बताइए: 3, 6, 12, __", options: ["15", "18", "24", "21"], explanation: "हर संख्या दोगुनी होती है: 3 × 2 = 6, 6 × 2 = 12 और 12 × 2 = 24।", hint: "हर संख्या को 2 से गुणा करें।" },
      mr: { prompt: "पुढील संख्या शोधा: 3, 6, 12, __", options: ["15", "18", "24", "21"], explanation: "प्रत्येक संख्या दुप्पट होते: 3 × 2 = 6, 6 × 2 = 12 आणि 12 × 2 = 24.", hint: "प्रत्येक संख्येला 2 ने गुणा करा." },
      ur: { prompt: "اگلا عدد بتائیں: 3، 6، 12، __", options: ["15", "18", "24", "21"], explanation: "ہر عدد دگنا ہوتا ہے: 3 × 2 = 6، 6 × 2 = 12 اور 12 × 2 = 24۔", hint: "ہر عدد کو 2 سے ضرب دیں۔" },
    }),
    q("b-square-sequence", "brain", "Number patterns", 5, "hard", 0, {
      en: { prompt: "Complete the pattern: 1, 4, 9, 16, __", options: ["25", "20", "24", "36"], explanation: "These are square numbers: 1², 2², 3², 4². The next is 5² = 25.", hint: "The numbers are 1×1, 2×2, 3×3, 4×4." },
      hi: { prompt: "पैटर्न पूरा करें: 1, 4, 9, 16, __", options: ["25", "20", "24", "36"], explanation: "ये वर्ग संख्याएँ हैं: 1², 2², 3², 4²। अगली 5² = 25 है।", hint: "ये 1×1, 2×2, 3×3, 4×4 से बनती हैं।" },
      mr: { prompt: "रचना पूर्ण करा: 1, 4, 9, 16, __", options: ["25", "20", "24", "36"], explanation: "या वर्गसंख्या आहेत: 1², 2², 3², 4². पुढची संख्या 5² = 25 आहे.", hint: "या संख्या 1×1, 2×2, 3×3, 4×4 अशा आहेत." },
      ur: { prompt: "ترتیب مکمل کریں: 1، 4، 9، 16، __", options: ["25", "20", "24", "36"], explanation: "یہ مربع اعداد ہیں: 1²، 2²، 3²، 4²۔ اگلا 5² = 25 ہے۔", hint: "یہ 1×1، 2×2، 3×3، 4×4 سے بنتے ہیں۔" },
    }),
  ],
  india: [
    q("i-capital", "india", "Indian geography", 1, "easy", 1, {
      en: { prompt: "What is the capital of India?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], explanation: "New Delhi is India's capital city.", hint: "It is a city in the National Capital Territory of Delhi." },
      hi: { prompt: "भारत की राजधानी क्या है?", options: ["मुंबई", "नई दिल्ली", "कोलकाता", "चेन्नई"], explanation: "नई दिल्ली भारत की राजधानी है।", hint: "यह दिल्ली के राष्ट्रीय राजधानी क्षेत्र में स्थित है।" },
      mr: { prompt: "भारताची राजधानी कोणती?", options: ["मुंबई", "नवी दिल्ली", "कोलकाता", "चेन्नई"], explanation: "नवी दिल्ली ही भारताची राजधानी आहे.", hint: "हे दिल्लीच्या राष्ट्रीय राजधानी क्षेत्रातील शहर आहे." },
      ur: { prompt: "بھارت کا دارالحکومت کیا ہے؟", options: ["ممبئی", "نئی دہلی", "کولکاتا", "چنئی"], explanation: "نئی دہلی بھارت کا دارالحکومت ہے۔", hint: "یہ دہلی کے قومی دارالحکومت خطے میں واقع ہے۔" },
    }),
    q("i-bird", "india", "National symbols", 1, "easy", 2, {
      en: { prompt: "Which bird is India's national bird?", options: ["sparrow", "parrot", "Indian peafowl", "eagle"], explanation: "The Indian peafowl, commonly called the peacock, is India's national bird.", hint: "This bird is known for its colourful, fan-shaped tail display." },
      hi: { prompt: "भारत का राष्ट्रीय पक्षी कौन-सा है?", options: ["गौरैया", "तोता", "मोर", "गरुड़"], explanation: "भारतीय मयूर, जिसे आम तौर पर मोर कहते हैं, भारत का राष्ट्रीय पक्षी है।", hint: "इस पक्षी की रंगीन पंखों वाली पूँछ पंखे जैसी फैलती है।" },
      mr: { prompt: "भारताचा राष्ट्रीय पक्षी कोणता?", options: ["चिमणी", "पोपट", "मोर", "गरुड"], explanation: "भारतीय मोर हा भारताचा राष्ट्रीय पक्षी आहे.", hint: "या पक्ष्याची रंगीत शेपटी पंख्यासारखी पसरते." },
      ur: { prompt: "بھارت کا قومی پرندہ کون سا ہے؟", options: ["چڑیا", "طوطا", "مور", "عقاب"], explanation: "ہندوستانی مور بھارت کا قومی پرندہ ہے۔", hint: "اس کے رنگین پر پنکھے کی طرح پھیلتے ہیں۔" },
    }),
    q("i-animal", "india", "National symbols", 1, "easy", 0, {
      en: { prompt: "Which animal is India's national animal?", options: ["Bengal tiger", "lion", "elephant", "leopard"], explanation: "The tiger is India's national animal; the Bengal tiger is native to the region.", hint: "This striped big cat is a powerful swimmer." },
      hi: { prompt: "भारत का राष्ट्रीय पशु कौन-सा है?", options: ["बंगाल टाइगर", "शेर", "हाथी", "तेंदुआ"], explanation: "बाघ भारत का राष्ट्रीय पशु है; बंगाल टाइगर इस क्षेत्र का मूल निवासी है।", hint: "यह धारियों वाली बड़ी बिल्ली अच्छी तैराक होती है।" },
      mr: { prompt: "भारताचा राष्ट्रीय प्राणी कोणता?", options: ["बंगाल वाघ", "सिंह", "हत्ती", "बिबट्या"], explanation: "वाघ हा भारताचा राष्ट्रीय प्राणी आहे; बंगाल वाघ या प्रदेशात आढळतो.", hint: "हा पट्टे असलेला मोठा मांजरवर्गीय प्राणी चांगला पोहतो." },
      ur: { prompt: "بھارت کا قومی جانور کون سا ہے؟", options: ["بنگال ٹائیگر", "شیر", "ہاتھی", "تیندوا"], explanation: "بھارت کا قومی جانور ٹائیگر ہے؛ بنگال ٹائیگر اس خطے کا مقامی جانور ہے۔", hint: "دھاریوں والی یہ بڑی بلی اچھی تیراک ہوتی ہے۔" },
    }),
    q("i-maharashtra", "india", "Maharashtra", 1, "easy", 1, {
      en: { prompt: "Which city is the capital of Maharashtra?", options: ["Pune", "Mumbai", "Nagpur", "Nashik"], explanation: "Mumbai is Maharashtra's capital. The state legislature also meets in Nagpur for its winter session.", hint: "This coastal city is also India's largest city by population within its city limits, though rankings depend on boundaries." },
      hi: { prompt: "महाराष्ट्र की राजधानी कौन-सी है?", options: ["पुणे", "मुंबई", "नागपुर", "नाशिक"], explanation: "मुंबई महाराष्ट्र की राजधानी है। राज्य विधानमंडल का शीतकालीन सत्र नागपुर में भी होता है।", hint: "यह समुद्र के किनारे बसा एक बड़ा शहर है।" },
      mr: { prompt: "महाराष्ट्राची राजधानी कोणती?", options: ["पुणे", "मुंबई", "नागपूर", "नाशिक"], explanation: "मुंबई ही महाराष्ट्राची राजधानी आहे. राज्य विधिमंडळाचे हिवाळी अधिवेशन नागपूर येथेही होते.", hint: "हे समुद्रकिनारी वसलेले मोठे शहर आहे." },
      ur: { prompt: "مہاراشٹر کا دارالحکومت کون سا شہر ہے؟", options: ["پونے", "ممبئی", "ناگپور", "ناسک"], explanation: "ممبئی مہاراشٹر کا دارالحکومت ہے۔ ریاستی اسمبلی کا سرمائی اجلاس ناگپور میں بھی ہوتا ہے۔", hint: "یہ سمندر کے کنارے واقع ایک بڑا شہر ہے۔" },
    }),
    q("i-ganga", "india", "Rivers", 1, "medium", 1, {
      en: { prompt: "In which large body of water does the Ganga river system reach the sea?", options: ["Arabian Sea", "Bay of Bengal", "Red Sea", "Caspian Sea"], explanation: "The Ganga joins the wider Ganga–Brahmaputra–Meghna river system, which reaches the Bay of Bengal.", hint: "It lies to the east of India." },
      hi: { prompt: "गंगा नदी तंत्र समुद्र तक पहुँचकर किस बड़े जलक्षेत्र में मिलता है?", options: ["अरब सागर", "बंगाल की खाड़ी", "लाल सागर", "कैस्पियन सागर"], explanation: "गंगा, व्यापक गंगा–ब्रह्मपुत्र–मेघना नदी तंत्र का भाग है, जो बंगाल की खाड़ी तक पहुँचता है।", hint: "यह भारत के पूर्व में स्थित है।" },
      mr: { prompt: "गंगा नदीप्रणाली समुद्राला मिळताना कोणत्या मोठ्या जलक्षेत्रात पोहोचते?", options: ["अरबी समुद्र", "बंगालचा उपसागर", "तांबडा समुद्र", "कॅस्पियन समुद्र"], explanation: "गंगा ही विस्तृत गंगा–ब्रह्मपुत्र–मेघना नदीप्रणालीचा भाग आहे; ही प्रणाली बंगालच्या उपसागरापर्यंत पोहोचते.", hint: "हे भारताच्या पूर्वेला आहे." },
      ur: { prompt: "گنگا کا دریائی نظام سمندر تک پہنچ کر کس بڑے آبی خطے میں ملتا ہے؟", options: ["بحیرۂ عرب", "خلیجِ بنگال", "بحیرۂ احمر", "بحیرۂ کیسپین"], explanation: "گنگا، وسیع تر گنگا–برہم پتر–میگھنا دریائی نظام کا حصہ ہے، جو خلیجِ بنگال تک پہنچتا ہے۔", hint: "یہ بھارت کے مشرق میں واقع ہے۔" },
    }),
    q("i-republic-day", "india", "Civics", 3, "medium", 0, {
      en: { prompt: "On which date does India celebrate Republic Day?", options: ["26 January", "15 August", "2 October", "14 November"], explanation: "India celebrates Republic Day on 26 January, when the Constitution came into effect in 1950.", hint: "It is in the first month of the year." },
      hi: { prompt: "भारत में गणतंत्र दिवस किस तारीख़ को मनाया जाता है?", options: ["26 जनवरी", "15 अगस्त", "2 अक्टूबर", "14 नवंबर"], explanation: "भारत में 26 जनवरी को गणतंत्र दिवस मनाया जाता है; इसी दिन 1950 में संविधान लागू हुआ।", hint: "यह वर्ष के पहले महीने में आता है।" },
      mr: { prompt: "भारतात प्रजासत्ताक दिन कोणत्या तारखेला साजरा करतात?", options: ["26 जानेवारी", "15 ऑगस्ट", "2 ऑक्टोबर", "14 नोव्हेंबर"], explanation: "भारतात 26 जानेवारीला प्रजासत्ताक दिन साजरा करतात. याच दिवशी 1950 मध्ये संविधान लागू झाले.", hint: "हा वर्षाच्या पहिल्या महिन्यात येतो." },
      ur: { prompt: "بھارت میں یومِ جمہوریہ کس تاریخ کو منایا جاتا ہے؟", options: ["26 جنوری", "15 اگست", "2 اکتوبر", "14 نومبر"], explanation: "بھارت میں 26 جنوری کو یومِ جمہوریہ منایا جاتا ہے؛ 1950 میں اسی دن آئین نافذ ہوا۔", hint: "یہ سال کے پہلے مہینے میں آتا ہے۔" },
    }),
    q("i-lok-sabha", "india", "Civics", 5, "hard", 2, {
      en: { prompt: "How are members of India's Lok Sabha chosen?", options: ["by lottery", "by appointment for life", "by voters in elections", "by school councils"], explanation: "Voters elect Lok Sabha members in general elections. The voting age for Indian citizens is 18.", hint: "People choose their representatives by voting." },
      hi: { prompt: "भारत की लोकसभा के सदस्य कैसे चुने जाते हैं?", options: ["लॉटरी से", "जीवनभर के लिए नियुक्ति से", "चुनाव में मतदाताओं द्वारा", "विद्यालय परिषद से"], explanation: "आम चुनाव में मतदाता लोकसभा के सदस्यों को चुनते हैं। भारतीय नागरिकों के लिए मतदान की उम्र 18 वर्ष है।", hint: "लोग वोट देकर अपने प्रतिनिधि चुनते हैं।" },
      mr: { prompt: "भारताच्या लोकसभेचे सदस्य कसे निवडले जातात?", options: ["सोडतीने", "आजीवन नियुक्तीने", "निवडणुकीत मतदारांकडून", "शालेय समित्यांकडून"], explanation: "सार्वत्रिक निवडणुकांमध्ये मतदार लोकसभेचे सदस्य निवडतात. भारतीय नागरिकांसाठी मतदानाचे वय 18 वर्षे आहे.", hint: "लोक मतदान करून आपले प्रतिनिधी निवडतात." },
      ur: { prompt: "بھارت کی لوک سبھا کے ارکان کیسے منتخب ہوتے ہیں؟", options: ["قرعہ اندازی سے", "تاحیات تقرری سے", "انتخابات میں ووٹروں کے ذریعے", "اسکول کونسلوں سے"], explanation: "عام انتخابات میں ووٹر لوک سبھا کے ارکان منتخب کرتے ہیں۔ بھارتی شہریوں کے لیے ووٹ ڈالنے کی عمر 18 سال ہے۔", hint: "لوگ ووٹ دے کر اپنے نمائندے چنتے ہیں۔" },
    }),
  ],
};

export const modes: GameMode[] = ["math", "words", "science", "brain", "india"];
export const modeCopyKeys: Record<GameMode, { title: "modeMath" | "modeWords" | "modeScience" | "modeBrain" | "modeIndia"; description: "modeMathDesc" | "modeWordsDesc" | "modeScienceDesc" | "modeBrainDesc" | "modeIndiaDesc" }> = {
  math: { title: "modeMath", description: "modeMathDesc" },
  words: { title: "modeWords", description: "modeWordsDesc" },
  science: { title: "modeScience", description: "modeScienceDesc" },
  brain: { title: "modeBrain", description: "modeBrainDesc" },
  india: { title: "modeIndia", description: "modeIndiaDesc" },
};

export function getQuestions(mode: GameMode, classLevel: number, language: Language): LearningQuestion[] {
  return questionBanks[mode]
    .filter((item) => item.minClass <= classLevel && item.content[language]?.prompt)
    .map((item) => item);
}

export function validateQuestionBank(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const mode of modes) {
    for (const item of questionBanks[mode]) {
      if (ids.has(item.id)) errors.push(`Duplicate question id: ${item.id}`);
      ids.add(item.id);
      if (!item.content || !item.content.en?.prompt || !item.content.en?.explanation) errors.push(`Missing English question or explanation: ${item.id}`);
      if (item.correctIndex < 0 || item.correctIndex > 3 || new Set(item.content.en.options).size !== 4) errors.push(`Invalid answer options: ${item.id}`);
      for (const language of ["en", "hi", "mr", "ur"] as const) {
        const localized = item.content[language];
        if (!localized?.prompt || !localized.explanation || localized.options.length !== 4 || !localized.options[item.correctIndex]) {
          errors.push(`Missing or invalid ${language} translation: ${item.id}`);
        }
      }
    }
  }
  return errors;
}
