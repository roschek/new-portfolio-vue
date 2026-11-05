// Languages the lecture can be translated into.
export const TARGET_LANGUAGES = [
  { code: "en", native: "English", english: "English" },
  { code: "he", native: "עברית", english: "Hebrew" },
  { code: "ru", native: "Русский", english: "Russian" },
  { code: "de", native: "Deutsch", english: "German" },
  { code: "es", native: "Español", english: "Spanish" },
];

export const languageName = (code, form = "native") =>
  TARGET_LANGUAGES.find((lang) => lang.code === code)?.[form] ?? code;
