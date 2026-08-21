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

const hasInvalidPathSegment = (path: string) => {
  try {
    const [pathname] = path.split(/[?#]/, 1);
    return decodeURIComponent(pathname)
      .split(/[\\/]/)
      .some((segment) => segment === "." || segment === "..");
  } catch {
    return true;
  }
};

const assertValidExternalUrl = (externalUrl: string, title: string) => {
  let url: URL;

  try {
    url = new URL(externalUrl);
  } catch {
    throw new Error(
      `Changelog「${title}」の link.url に有効な URL を設定してください: ${externalUrl}`,
    );
  }

  if (
    externalUrl !== externalUrl.trim() ||
    url.protocol !== "https:" ||
    !url.hostname
  ) {
    throw new Error(
      `Changelog「${title}」の link.url は有効な https:// URL にしてください: ${externalUrl}`,
    );
  }
};

const assertValidInternalPath = (path: string, title: string) => {
  let resolvedUrl: URL;

  try {
    resolvedUrl = new URL(path, internalPathValidationBaseUrl);
  } catch {
    throw new Error(
      `Changelog「${title}」の link.path に有効なパスを設定してください: ${path}`,
    );
  }

  if (
    !path ||
    path !== path.trim() ||
    path.startsWith("/") ||
    hasInvalidPathSegment(path) ||
    resolvedUrl.origin !== internalPathValidationBaseUrl.origin ||
    !resolvedUrl.pathname.startsWith(internalPathValidationBaseUrl.pathname)
  ) {
    throw new Error(
      `Changelog「${title}」の link.path は BASE_URL 配下の相対パスで設定してください: ${path}`,
    );
  }
};

const assertValidLink = (link: ChangelogLink, title: string) => {
  if (link.kind === "external") {
    assertValidExternalUrl(link.url, title);
    return;
  }

  assertValidInternalPath(link.path, title);
};

const assertValidEntry = ({
  date,
  title,
  description,
  link,
}: ChangelogEntry) => {
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
    assertValidLink(link, title);
  }
};

export const prepareChangelogEntries = (
  entries: readonly ChangelogEntry[],
): readonly ChangelogEntry[] => {
  entries.forEach(assertValidEntry);
  return Object.freeze(
    entries.toSorted((a, b) => b.date.localeCompare(a.date)),
  );
};
