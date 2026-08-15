import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

import { noteCategoryValues } from "./config/noteCategories";

const notes = defineCollection({
  loader: glob({
    base: "./src/content/notes",
    pattern: "**/*.md",
  }),
  schema: z
    .object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      category: z.enum(noteCategoryValues),
      draft: z.boolean().default(false),
      ogImage: z.string().trim().min(1).optional(),
      ogImageAlt: z.string().trim().min(1).optional(),
    })
    .refine(
      ({ ogImage, ogImageAlt }) => Boolean(ogImage) === Boolean(ogImageAlt),
      {
        message: "ogImage と ogImageAlt はセットで指定してください。",
        path: ["ogImageAlt"],
      },
    ),
});

export const collections = { notes };
