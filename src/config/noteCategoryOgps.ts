import type { NoteCategory } from "./noteCategories";

type NoteCategoryOgp = {
  image: string;
  imageAlt: string;
};

export const noteCategoryOgps: Partial<Record<NoteCategory, NoteCategoryOgp>> =
  {
    tech: {
      image: "/og-image-note-tech.png",
      imageAlt: "ノートパソコンで作業するコーギーと TECH の文字",
    },
  };
