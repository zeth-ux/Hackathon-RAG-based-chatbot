// Quiz questions — one per source file, grounded directly in that file's
// content. No invented facts: every correct answer and explanation traces
// back to the actual text in data/seerah_sources.
const QUIZ = [
  {
    id: "q1",
    prompt: "What name was Muhammad ﷺ known by among the Quraysh for his honesty?",
    options: ["Al-Amin (the trustworthy)", "Al-Sadiq", "Al-Rashid", "Al-Karim"],
    correctIndex: 0,
    explanation: "He became known among the Quraysh for honesty and trustworthiness and was called al-Amin.",
    source: "Ar-Raheeq Al-Makhtum — Birth, childhood, and youth in Makkah",
  },
  {
    id: "q2",
    prompt: "In which cave did the first revelation take place?",
    options: ["Cave of Thawr", "Cave of Hira", "Cave of Uhud", "Cave of Badr"],
    correctIndex: 1,
    explanation: "During a retreat in the cave of Hira in Ramadan, the angel Jibril brought the first revelation.",
    source: "Ar-Raheeq Al-Makhtum — First revelation and the beginning of the call",
  },
  {
    id: "q3",
    prompt: "Who purchased Bilal ibn Rabah's freedom after his torture in Makkah?",
    options: ["Umar ibn al-Khattab", "Uthman ibn Affan", "Abu Bakr", "Ali ibn Abi Talib"],
    correctIndex: 2,
    explanation: "Bilal was tortured by Umayyah ibn Khalaf; Abu Bakr later purchased his freedom.",
    source: "Ibn Hisham, Sirat Rasul Allah — Persecution in Makkah and the migrations to Abyssinia",
  },
  {
    id: "q4",
    prompt: "Which cave did the Prophet ﷺ and Abu Bakr hide in during the Hijrah?",
    options: ["Cave of Hira", "Cave of Thawr", "Cave of Uhud", "Cave of Safa"],
    correctIndex: 1,
    explanation: "They hid in the cave of Thawr while Quraysh searched for them.",
    source: "Ar-Raheeq Al-Makhtum — The Year of Sorrow, Ta'if, and the Hijrah to Madinah",
  },
  {
    id: "q5",
    prompt: "What is the written pact from the early Madinan period commonly called?",
    options: ["Treaty of Hudaybiyyah", "Covenant of Aqabah", "Constitution of Madinah", "Charter of Quraysh"],
    correctIndex: 2,
    explanation: "A written pact known as the Constitution of Madinah (sahifat al-Madinah) bound the community together.",
    source: "Ibn Hisham, Sirat Rasul Allah — The Madinan community and the Constitution of Madinah",
  },
  {
    id: "q6",
    prompt: "Whose advice led to digging a trench to defend Madinah?",
    options: ["Khalid ibn al-Walid", "Bilal ibn Rabah", "Abu Talib", "Salman al-Farisi"],
    correctIndex: 3,
    explanation: "On the advice of Salman al-Farisi, the Muslims dug a trench on the exposed side of the town.",
    source: "Ar-Raheeq Al-Makhtum — Badr, Uhud, and the Trench",
  },
  {
    id: "q7",
    prompt: "How long was the truce agreed at the Treaty of Hudaybiyyah meant to last?",
    options: ["Five years", "Ten years", "One year", "Twenty years"],
    correctIndex: 1,
    explanation: "The treaty's terms included a ten-year truce between the Muslims and Quraysh.",
    source: "Ar-Raheeq Al-Makhtum — Hudaybiyyah, the opening of Makkah, and the Farewell Pilgrimage",
  },
  {
    id: "q8",
    prompt: "Which of the Prophet's ﷺ children lived to have descendants?",
    options: ["Zaynab", "Ruqayyah", "Fatimah", "Umm Kulthum"],
    correctIndex: 2,
    explanation: "His surviving child who lived to have descendants was Fatimah, married to Ali ibn Abi Talib.",
    source: "Ar-Raheeq Al-Makhtum — Character, household, and daily conduct",
  },
];
