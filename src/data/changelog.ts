export type ChangelogLink =
  | { readonly kind: "internal"; readonly path: string }
  | { readonly kind: "external"; readonly url: string };

export interface ChangelogEntry {
  readonly date: string;
  readonly title: string;
  readonly description: string;
  readonly link?: ChangelogLink;
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const internalPathValidationBaseUrl = new URL(
  "https://changelog.invalid/base/",
);

const hasInvalidOrTraversalSegment = (path: string) => {
  try {
    const [pathname] = path.split(/[?#]/, 1);
    return pathname
      .split(/[\\/]/)
      .some((segment) => [".", ".."].includes(decodeURIComponent(segment)));
  } catch {
    return true;
  }
};

const validateLink = (link: ChangelogLink, title: string) => {
  if (link.kind === "external") {
    let url: URL;

    try {
      url = new URL(link.url);
    } catch {
      throw new Error(
        `Changelog「${title}」の link.url に有効な URL を設定してください: ${link.url}`,
      );
    }

    if (
      link.url !== link.url.trim() ||
      url.protocol !== "https:" ||
      !url.hostname
    ) {
      throw new Error(
        `Changelog「${title}」の link.url は有効な https:// URL にしてください: ${link.url}`,
      );
    }

    return;
  }

  let resolvedUrl: URL;

  try {
    resolvedUrl = new URL(link.path, internalPathValidationBaseUrl);
  } catch {
    throw new Error(
      `Changelog「${title}」の link.path に有効なパスを設定してください: ${link.path}`,
    );
  }

  if (
    !link.path ||
    link.path !== link.path.trim() ||
    link.path.startsWith("/") ||
    hasInvalidOrTraversalSegment(link.path) ||
    resolvedUrl.origin !== internalPathValidationBaseUrl.origin ||
    !resolvedUrl.pathname.startsWith(internalPathValidationBaseUrl.pathname)
  ) {
    throw new Error(
      `Changelog「${title}」の link.path は BASE_URL 配下の相対パスで設定してください: ${link.path}`,
    );
  }
};

const validateEntry = ({ date, title, description, link }: ChangelogEntry) => {
  if (!title.trim()) {
    throw new Error("Changelog の title は空にできません。");
  }

  if (!description.trim()) {
    throw new Error(`Changelog「${title}」の description は空にできません。`);
  }

  if (!datePattern.test(date)) {
    throw new Error(
      `Changelog「${title}」の date は YYYY-MM-DD 形式で設定してください: ${date}`,
    );
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (
    Number.isNaN(parsedDate.valueOf()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`Changelog「${title}」の date が不正です: ${date}`);
  }

  if (link) {
    validateLink(link, title);
  }
};

const createChangelogEntries = (
  entries: readonly ChangelogEntry[],
): readonly ChangelogEntry[] => {
  entries.forEach(validateEntry);
  return Object.freeze(
    entries.toSorted((a, b) => b.date.localeCompare(a.date)),
  );
};

const rawChangelogEntries = [
  {
    date: "2026-08-20",
    title: "Changelog ページを追加",
    description:
      "サイトと制作物の主要な更新を、時系列で確認できるようになりました。",
  },
  {
    date: "2026-08-19",
    title: "モバイル向けナビゲーションを改善",
    description:
      "小さな画面でもサイト内を移動しやすい、開閉式のメニューを追加しました。",
  },
  {
    date: "2026-08-17",
    title: "Contact ページを追加",
    description: "連絡先と、お問い合わせ時に必要な情報をまとめました。",
    link: {
      kind: "internal",
      path: "contact/",
    },
  },
  {
    date: "2026-08-15",
    title: "Notes を公開",
    description: "技術メモや日々の記録を掲載する Notes を追加しました。",
    link: {
      kind: "internal",
      path: "notes/",
    },
  },
  {
    date: "2026-08-15",
    title: "Works ページを追加",
    description: "個人で制作・運用しているプロダクトの紹介を追加しました。",
    link: {
      kind: "internal",
      path: "works/",
    },
  },
  {
    date: "2026-08-12",
    title: "独自ドメインで公開",
    description:
      "workingcorgi.com でサイトを公開し、GitHub と X のプロフィールを整えました。",
  },
  {
    date: "2026-08-10",
    title: "About ページを追加",
    description:
      "経歴や得意分野、現在取り組んでいることを紹介するページを追加しました。",
    link: {
      kind: "internal",
      path: "about/",
    },
  },
  {
    date: "2026-08-10",
    title: "Working Corgi を公開",
    description: "個人サイトのトップページと共通デザインを公開しました。",
  },
] as const satisfies readonly ChangelogEntry[];

export const changelogEntries = createChangelogEntries(rawChangelogEntries);
