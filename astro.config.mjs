// @ts-check
import { defineConfig } from "astro/config";
import { unified, rehypeHeadingIds } from "@astrojs/markdown-remark";
import sitemap from "@astrojs/sitemap";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// https://astro.build/config
export default defineConfig({
  site: "https://workingcorgi.com",
  integrations: [sitemap()],
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeHeadingIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: "append",
            content: {
              type: "text",
              value: "#",
            },
            properties: {
              className: ["heading-anchor"],
              ariaLabel: "この見出しへのリンク",
            },
          },
        ],
      ],
    }),
  },
});
