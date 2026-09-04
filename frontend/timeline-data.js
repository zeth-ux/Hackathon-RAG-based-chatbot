// Timeline events — one per existing source file in data/seerah_sources.
// No dates or summaries are hardcoded here on purpose: clicking a card asks
// the existing RAG assistant, so every fact shown to the user always comes
// from the real, grounded /ask pipeline — never invented on the frontend.
const TIMELINE = [
  {
    id: "birth",
    title: "Birth & Early Life",
    question: "Where and when was the Prophet ﷺ born, and who raised him in his early years?",
  },
  {
    id: "revelation",
    title: "The First Revelation",
    question: "What happened at the cave of Hira during the first revelation?",
  },
  {
    id: "persecution",
    title: "Persecution in Makkah",
    question: "How were the early Muslims persecuted in Makkah?",
  },
  {
    id: "hijrah",
    title: "The Hijrah",
    question: "Why did the Muslims migrate from Makkah to Madinah?",
  },
  {
    id: "madinah",
    title: "Building the Madinah Community",
    question: "How did the Prophet ﷺ build the community in Madinah after the Hijrah?",
  },
  {
    id: "battles",
    title: "Badr, Uhud & the Trench",
    question: "What happened at the battles of Badr, Uhud, and the Trench?",
  },
  {
    id: "hudaybiyyah",
    title: "Hudaybiyyah & the Farewell",
    question: "What was the Treaty of Hudaybiyyah, and what happened afterward at the conquest of Makkah?",
  },
  {
    id: "character",
    title: "Character & Household",
    question: "What was the Prophet ﷺ like in character and in his household life?",
  },
];
