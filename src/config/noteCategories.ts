export const noteCategories = {
  tech: {
    label: "Tech",
  },
  note: {
    label: "Note",
  },
  devlog: {
    label: "Development Log",
  },
} as const;

export type NoteCategory = keyof typeof noteCategories;

export const noteCategoryValues = Object.keys(noteCategories) as [
  NoteCategory,
  ...NoteCategory[],
];
