import type { ChangelogLink } from "../domain/changelog";

export const formatChangelogDate = (date: string) => date.replaceAll("-", ".");

export const getChangelogLinkHref = (link: ChangelogLink, baseUrl: string) =>
  link.kind === "external" ? link.url : `${baseUrl}${link.path}`;
