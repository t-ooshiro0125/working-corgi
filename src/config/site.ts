const siteName = "Working Corgi";

export const site = {
  name: siteName,
  defaultDescription: "ACorgi0125 の個人サイトです。",
  defaultOgp: {
    image: "/og-image.png",
    imageAlt: `${siteName} のロゴと、キャップをかぶったコーギーのイラスト`,
  },
} as const;

export const profiles = {
  github: {
    label: "GitHub",
    url: "https://github.com/t-ooshiro0125",
    handle: "t-ooshiro0125",
  },
  x: {
    label: "X",
    url: "https://x.com/working_corgi",
    handle: "@working_corgi",
  },
} as const;

export const profileItems = [profiles.github, profiles.x] as const;

const navigationLinks = {
  home: { label: "Home", path: "" },
  about: { label: "About", path: "about/" },
  works: { label: "Works", path: "works/" },
  notes: { label: "Notes", path: "notes/" },
  contact: { label: "Contact", path: "contact/" },
  changelog: { label: "Changelog", path: "changelog/" },
} as const;

export const headerNavigationItems = [
  navigationLinks.home,
  navigationLinks.about,
  navigationLinks.works,
  navigationLinks.notes,
  navigationLinks.contact,
] as const;

export const footerNavigationItems = [
  navigationLinks.home,
  navigationLinks.about,
  navigationLinks.works,
  navigationLinks.notes,
  navigationLinks.changelog,
  navigationLinks.contact,
] as const;
