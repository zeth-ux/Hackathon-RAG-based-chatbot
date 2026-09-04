// Timeline events — one per source file in data/seerah_sources.
// period/summary are short paraphrases grounded directly in that file's
// content (not invented). Clicking a card still asks the live RAG
// assistant via the existing /ask flow for the full, cited answer.
const TIMELINE = [
  {
    id: "birth",
    title: "Birth & Early Life",
    period: "c. 570 CE · Makkah",
    summary: "Born in Makkah, orphaned young, raised by his grandfather and uncle; earned the name al-Amin for his honesty.",
    question: "Where and when was the Prophet ﷺ born, and who raised him in his early years?",
  },
  {
    id: "revelation",
    title: "The First Revelation",
    period: "610 CE · Cave of Hira",
    summary: "At forty, the angel Jibril brought the first verses of the Qur'an to him in the cave of Hira.",
    question: "What happened at the cave of Hira during the first revelation?",
  },
  {
    id: "persecution",
    title: "Persecution in Makkah",
    period: "610s CE · Makkah & Abyssinia",
    summary: "Quraysh persecuted the growing Muslim community; some migrated to Abyssinia for protection.",
    question: "How were the early Muslims persecuted in Makkah?",
  },
  {
    id: "hijrah",
    title: "The Hijrah",
    period: "622 CE · Makkah to Madinah",
    summary: "After the Year of Sorrow and rejection at Ta'if, the Prophet ﷺ migrated from Makkah to Madinah.",
    question: "Why did the Muslims migrate from Makkah to Madinah?",
  },
  {
    id: "madinah",
    title: "Building the Madinah Community",
    period: "622 CE onward · Madinah",
    summary: "A written pact bound the Muhajirun, Ansar, and Jewish tribes into one town under shared defence.",
    question: "How did the Prophet ﷺ build the community in Madinah after the Hijrah?",
  },
  {
    id: "battles",
    title: "Badr, Uhud & the Trench",
    period: "624–627 CE · 2–5 AH",
    summary: "Three defining campaigns: victory at Badr, a hard lesson at Uhud, and a successful siege defence at the Trench.",
    question: "What happened at the battles of Badr, Uhud, and the Trench?",
  },
  {
    id: "hudaybiyyah",
    title: "Hudaybiyyah & the Farewell",
    period: "628–632 CE · 6–11 AH",
    summary: "A ten-year truce at Hudaybiyyah opened the way to the largely peaceful opening of Makkah and the Farewell Sermon.",
    question: "What was the Treaty of Hudaybiyyah, and what happened afterward at the conquest of Makkah?",
  },
  {
    id: "character",
    title: "Character & Household",
    period: "Throughout his life",
    summary: "Known for gentleness at home, fairness in judgment, and patience even under hardship.",
    question: "What was the Prophet ﷺ like in character and in his household life?",
  },
];